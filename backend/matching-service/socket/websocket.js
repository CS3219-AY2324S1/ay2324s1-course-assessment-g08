const { instrument } = require("@socket.io/admin-ui");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();
const waitingListRepo = require("../db/repositories/waitingListRepo");

const initializeWebSocket = (server) => {
    const io = require("socket.io")(server, {
        path: '/matching-service/socket.io',
        cors: {
            origin: ['http://localhost:3000', 'https://peer-prep-ywhzo.ondigitalocean.app'],
            credentials: true,
        },
    });

    io.use((socket, next) => {
        const token = socket.handshake.query.token;

        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
            if (err) {
                return next(new Error("Authentication Error"));
            }

            socket.username = decoded.username;
            next();
        });
    });

    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.id}`);

        socket.on("disconnect", () => {
            console.log(socket.username + " removed from queue");
            console.log(`User disconnected: ${socket.id}`);
            waitingListRepo.deleteByUsername(socket.username);
        });

        socket.on("joinQueue", async (queueComplexity) => {
            const otherUser = await waitingListRepo.getByComplexity(
                queueComplexity
            );

            // No other user queuing for that complexity yet.
            if (otherUser == null) {
                const roomId = uuidv4();
                socket.join(roomId);
                console.log(socket.username + " added to queue");
                waitingListRepo.addEntry(
                    socket.username,
                    queueComplexity,
                    roomId
                );
                return;
            }

            const sharedRoomId = otherUser.roomId;
            socket.join(sharedRoomId);

            io.to(socket.id).emit("createRoom", sharedRoomId, queueComplexity);
            io.to(sharedRoomId).emit("matchfound", sharedRoomId);
        });
    });

    instrument(io, { auth: false });
};

module.exports = {
    initializeWebSocket,
};
