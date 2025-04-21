import { io, Socket } from "socket.io-client";

const protocol = window.location.protocol === "https:" ? "wss" : "ws";
const host = window.location.hostname;
const port = window.location.port === "5173" ? "3000" : window.location.port;

export const socket: Socket = io(`${protocol}://${host}:${port}`, {
  transports: ["websocket"],
});
