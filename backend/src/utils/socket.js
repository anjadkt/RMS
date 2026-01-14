const {Server} = require('socket.io');
require('dotenv').config();
const AppError = require('./AppError.js');

const {USERFRONT_END_URL,STAFFFRONT_END_URL} = process.env ;

let io ;

const initSocket = (server)=>{
  io = new Server(server,{
    cors : {
      origin : [USERFRONT_END_URL,STAFFFRONT_END_URL],
      methods : ["GET","POST"],
      credentials : true
    }
  });

  io.on("connection",(socket)=>{
    console.log("user connected",socket.id);

    socket.on("user-login",({ userId, role })=>{
      if(role==="cook"){
        socket.join(role);
      }else{
        socket.join(`${role}-${userId}`);
      }
    });

    socket.on("disconnect", () => {
      console.log("user disconnected", socket.id);
    })
  })
}

const getIO = () => {
  if (!io) {
    throw new AppError("Socket.io not initialized. Call initSocket first.",400);
  }
  return io;
};

module.exports = {getIO,initSocket}