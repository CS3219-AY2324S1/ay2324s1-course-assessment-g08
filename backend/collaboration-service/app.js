const express = require("express");
const http = require("http");
const ACTIONS = require("./Actions");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { testDbConnection } = require("./db/db");
const roomRepo = require("./db/repositories/RoomRepo");
const collaborationRoute = require("./routes/collaborationRoute");
const cors = require("cors");
const clientMapRepo = require("./db/repositories/ClientMapRepo");

testDbConnection();

// server
const app = express();
const server = http.createServer(app);

app.use(express.json());
const corsOption = {
    origin: ['http://localhost:3000', 'https://peer-prep-ywhzo.ondigitalocean.app'],
    methods: 'GET, POST, DELETE, PUT',
    credentials: true
};
app.use(cors(corsOption));

const io = require("socket.io")(server, {
    path: '/collaboration-service/socket.io',
    cors: {
        origin: ['http://localhost:3000', 'https://peer-prep-ywhzo.ondigitalocean.app'],
        credentials: true
    },
});

async function getAllConnectedClients(roomId) {
    const socketIds = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
    const clientPromises = socketIds.map(async (socketId) => {
        const clientMap = await clientMapRepo.getBySocketId(socketId);

        if (clientMap === null) {
            return;
        }

        const username = clientMap.username;
        return { socketId, username };
    });

    return Promise.all(clientPromises);
}

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

io.use(async (socket, next) => {
    const roomId = socket.handshake.query.roomId;

    if ((await roomRepo.getByRoomId(roomId)) === null) {
        return next(new Error("Room does not exist"));
    }

    socket.roomId = roomId;

    next();
});

io.on("connection", (socket) => {
    socket.on(ACTIONS.JOIN, async ({ roomId }) => {
        await clientMapRepo.addEntry(socket.id, socket.username);
        const clients = await getAllConnectedClients(roomId);

        if (clients.length >= 2) {
            io.to(socket.id).emit(ACTIONS.JOIN_FAILED);
            return;
        }

        console.log(`${socket.username} connected to room ${roomId}`);

        socket.join(roomId);
        // await clientMapRepo.addEntry(socket.id, socket.username);
        clients.push({ socketId: socket.id, username: socket.username });

        console.log(clients);

        clients.forEach(({ socketId }) => {
            io.to(socketId).emit(ACTIONS.JOINED, {
                clients,
                socketId: socket.id,
                username: socket.username,
                fromSocket: socketId
            });
        });
    });

    socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
        socket.in(roomId).emit(ACTIONS.CODE_CHANGE, {
            code,
        });
    });

    socket.on(ACTIONS.CHANGE_LANGUAGE, ({ roomId, language }) => {
        socket.in(roomId).emit(ACTIONS.CHANGE_LANGUAGE, {
            language,
        });
    });

    socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
        io.to(socketId).emit(ACTIONS.CODE_CHANGE, {
            code,
        });
    });

    socket.on(ACTIONS.EXECUTE_CODE, ({ roomId, result }) => {
        socket.in(roomId).emit(ACTIONS.EXECUTE_CODE, {
            result
        });
    });

    socket.on(ACTIONS.CODE_EXECUTING, ({ roomId }) => {
        socket.in(roomId).emit(ACTIONS.CODE_EXECUTING);
    });

    socket.on(ACTIONS.SYNC_QUESTION, ({ roomId, newQuestionId }) => {
        socket.in(roomId).emit(ACTIONS.SYNC_QUESTION, {
            newQuestionId
        });

        io.to(socket.id).emit(ACTIONS.SYNC_QUESTION, {
            newQuestionId
        });
    });

    socket.on(ACTIONS.REQUEST_QUESTION_CHANGE, async ({ roomId, complexity }) => {
        const clients = await getAllConnectedClients(roomId);

        if (clients.length < 2) {
            io.to(socket.id).emit(ACTIONS.CHANGE_QUESTION, {
                complexity
            });

            return;
        }

        socket.in(roomId).emit(ACTIONS.REQUEST_QUESTION_CHANGE, {
            complexity
        });
    });

    socket.on(ACTIONS.DECLINE_QUESTION_CHANGE, ({ roomId }) => {
        socket.in(roomId).emit(ACTIONS.DECLINE_QUESTION_CHANGE);
    });

    socket.on(ACTIONS.CHECK_SYNC, ({ roomId, template }) => {
        socket.in(roomId).emit(ACTIONS.CHECK_SYNC, {
            template,
            socketId: socket.id
        });
    });

    socket.on("disconnecting", async () => {
        const clientMapping = await clientMapRepo.getBySocketId(socket.id);

        socket.in(socket.roomId).emit(ACTIONS.DISCONNECTED, {
            socketId: socket.id,
            username: clientMapping.username
        });

        await clientMapRepo.deleteBySocketId(socket.id);
        socket.leave();
    });

    socket.on("disconnect", async () => {
        const allClients = await getAllConnectedClients(socket.roomId);
        if (allClients.length == 0) {
            await roomRepo.deleteById(socket.roomId);
        }

        console.log(`User disconnected: ${socket.id}`);
    });
});

app.use("/collaboration-service", collaborationRoute);

// Error handling middleware
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        msg: err.message || "Internal Server Error",
    });
});

const PORT = process.env.PORT || 3004;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
