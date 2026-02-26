// lib/socket.ts
import { io } from "socket.io-client";

// Connect to the backend URL
export const socket = io("http://localhost:3001", {
  autoConnect: false,
});