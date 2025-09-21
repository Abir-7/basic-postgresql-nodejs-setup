/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";

import logger from "../../utils/serverTools/logger";

import redis from "../../lib/redis/redis";
import { jsonWebToken } from "../../utils/jwt/jwt";

interface User {
  user_id: string;
  socket_id: string;
}

const connectedUsers = new Map<string, User>();
let io: SocketIOServer | null = null;

export const initSocket = async (httpServer: HttpServer) => {
  io = new SocketIOServer(httpServer, {
    cors: { origin: "*", methods: ["GET", "POST"] },
    maxHttpBufferSize: 1e6, // 1MB per message
  });

  // ------------------- Redis Adapter -------------------
  const pubClient = redis;
  const subClient = pubClient.duplicate();
  io.adapter(createAdapter(pubClient, subClient));

  // ------------------- JWT Auth -------------------
  io.use((socket, next) => {
    try {
      let token =
        socket.handshake.auth?.token ||
        (socket.handshake.headers["authorization"] as string | undefined);
      if (!token) throw new Error("Missing token");
      if (token.startsWith("Bearer ")) token = token.split(" ")[1];

      const payload = jsonWebToken.decodeToken(token) as any;
      if (!payload?.user_id) throw new Error("Invalid token payload");

      (socket as any).user_id = payload.user_id;
      next();
    } catch (err) {
      logger.warn(`Socket ${socket.id} failed auth: ${err}`);
      next(new Error("Authentication error"));
    }
  });

  // ------------------- Connection -------------------
  io.on("connection", (socket) => {
    const user_id = (socket as any).user_id;
    connectedUsers.set(user_id, { user_id, socket_id: socket.id });
    logger.info(`User ${user_id} connected with socket ${socket.id}`);

    // ------------------- Disconnect -------------------
    socket.on("disconnect", () => {
      connectedUsers.delete(user_id);
      logger.info(`User ${user_id} disconnected from socket ${socket.id}`);
    });
  });

  return io;
};

export const getSocket = () => {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
};

export const getConnectedUsers = () => connectedUsers;
