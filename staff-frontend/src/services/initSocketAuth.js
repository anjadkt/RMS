import socket from "./socket";

let authInitialized = false;

export default function initSocketAuth({ _id, role }) {
  if (!socket.connected) {
    socket.connect();
  }

  if (!authInitialized) {
    socket.emit("user-login", {
      userId: _id,
      role,
    });

    authInitialized = true;
  }
}
