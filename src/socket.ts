import { io, Socket } from "socket.io-client";

const socketUrl =
  import.meta.env.PROD
    ? "wss://backsw1.onrender.com" // ✅ Producción (Vercel)
    : "ws://localhost:3000";        // ✅ Desarrollo local
    console.log(import.meta.env.PROD); // true en Vercel, false en localhost

export const socket: Socket = io(socketUrl, {
  transports: ["websocket"],
  
});
