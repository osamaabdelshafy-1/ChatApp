const { Server } = require("socket.io");
const http = require("http");
const express = require("express");
const socketAuthMiddleware = require("../middlewares/socket.auth.middleware");
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [process.env.CLIENT_URL],
    credentials: true, //only client send cookies
  },
});

//  apply authentication middleware to all socket connections

io.use(socketAuthMiddleware);

//use it to check if user online or not
function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

//for each user
//for onlineUser      {userId : socketId}

// this is for storig online users
const userSocketMap = {}; // {userId:socketId}

io.on("connection", (socket) => {
  console.log("A user connected", socket.user.fullName);

  const userId = socket.userId;
  userSocketMap[userId] = socket.id;

  // io.emit() is used to send events to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // with socket.on we listen for events from clients
  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.user.fullName);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

module.exports = {
  io,
  app,
  server,
  getReceiverSocketId,
};
