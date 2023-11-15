const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  path: "/communication-service/socket.io",
  cors: {
    origin: ['http://localhost:3000', 'https://peer-prep-ywhzo.ondigitalocean.app'],
    methods: ["GET", "POST"],
    credentials: true
  },
});

// Store mapping of room/socket IDs to their respective socket instances
const clients = {};
const users = {};
const socketToRoom = {};

io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // When a client wants to join a room
  socket.on("join", (roomId) => {
    socket.join(roomId);
    clients[socket.id] = socket;
  });

  // Handle sending messages
  socket.on("message", (data) => {
    const { roomId, message } = data;
    // Send message to all clients in the room except the sender
    socket.to(roomId).emit("receive-message", message);
  });

  socket.on("join room", (roomID) => {
    console.log("joining called ");
    if (users[roomID]) {
      const length = users[roomID].length;
      if (length === 4) {
        socket.emit("room full");
        return;
      }
      users[roomID].push(socket.id);
    } else {
      users[roomID] = [socket.id];
    }
    socketToRoom[socket.id] = roomID;
    const usersInThisRoom = users[roomID].filter((id) => id !== socket.id);
    console.log(usersInThisRoom);
    socket.emit("all users", usersInThisRoom);
  });

  socket.on("sending signal", (payload) => {
    console.log("sending called");
    io.to(payload.userToSignal).emit("user joined", {
      signal: payload.signal,
      callerID: payload.callerID,
    });
  });

  socket.on("returning signal", (payload) => {
    console.log("returning called");
    io.to(payload.callerID).emit("receiving returned signal", {
      signal: payload.signal,
      id: socket.id,
    });
  });

  socket.on("disconnect", () => {
    const roomID = socketToRoom[socket.id];
    let room = users[roomID];
    if (room) {
      room = room.filter((id) => id !== socket.id);
      users[roomID] = room;
      // Emit a user-disconnected event to remaining users in the room
      room.forEach((userId) => {
        if (clients[userId]) {
          clients[userId].emit("user-disconnected", socket.id);
        }
      });
    }
  });
});

const PORT = 3005;
server.listen(PORT, () => {
  console.log(`WebSocket server listening on port ${PORT}`);
});
