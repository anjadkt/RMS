const { Server } = require("socket.io");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const cookie = require("cookie");

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: [
        process.env.USERFRONT_END_URL,
        process.env.STAFFFRONT_END_URL,
      ],
      credentials: true,
    },
  });

  io.use((socket, next) => {
    try {
      const cookieHeader =
        socket.handshake.headers.cookie ||
        socket.handshake.auth?.cookie;

      if (!cookieHeader) {
        return next(new Error("No cookies found"));
      }

      const parsedCookies = cookie.parse(cookieHeader);
      const token = parsedCookies.access_token;

      if (!token) {
        return next(new Error("No token found"));
      }

      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      console.log(decoded)
      socket.user = decoded;

      next();
    } catch (err) {
      next(new Error("Invalid or expired token"));
    }
  });

  io.on("connection", (socket) => {
    console.log("✅ user connected:", socket.id);

    const { _id, role , id} = socket.user;

    if (role === "cook") {
      socket.join("cook");
    } else {
      socket.join(_id);
    }

    socket.on("disconnect", () => {
      console.log("❌ user disconnected:", socket.id);
    });
  });
};

const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};

module.exports = { initSocket, getIO };
