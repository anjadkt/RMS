import {io} from 'socket.io-client'

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ;

const socket = io.connect(BACKEND_URL,{autoConnect : false ,  withCredentials: true , transports: ["websocket"]});

socket.on("connect_error", (err) => {
  console.log("Socket error:", err.message);
});

export default socket ;