import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";

const app = express();

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("chat message", (msg) => {
    console.log("message: " + msg);
    socket.emit("chat message", msg);
  });
  socket.on("disconnect", (msg) => {
    console.log("a user disconnected");
  });
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
