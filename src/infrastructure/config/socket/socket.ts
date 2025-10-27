import { Server } from "socket.io";

import { ITokenService } from "../../../domain/service-interfaces/token-service.interface";
import { IChatSocketHandler } from "../../../presentation/interfaces/socket/chat-socket-handler.interface";
import { IGroupChatSocketHandler } from "../../../presentation/interfaces/socket/group-chat-socket-handler.interface";
import { socketAuthMiddleware } from "../../../presentation/middlewares/socketAuth.middleware";

import { userConnected, userDisconnected } from "./onlineUsers";
export function configureSocket(
  io: Server,
  chatSocketHandler: IChatSocketHandler,
  groupChatSocketHandler: IGroupChatSocketHandler,
  tokenService: ITokenService
) {
  console.log("Socket configuration triggered");
  
  io.use(socketAuthMiddleware(tokenService, ["client", "guide", "vendor"]));

 io.on("connection", (socket) => {
  console.log(`🟢 Socket connected: ${socket.id}, User: ${socket.data.userId}`);

  const isFirst = userConnected(socket.data.userId, socket.id);

  // Emit online only if first socket for that user
  if (isFirst) {
    io.emit("user_online", { userId: socket.data.userId });
  }

  console.log("🔵 Registering chat socket handler...");
  chatSocketHandler.register(io, socket);
  
  console.log("🔵 Registering group chat socket handler...");
  groupChatSocketHandler.register(io, socket);

  socket.on("disconnect", () => {
    console.log(`🔴 Socket disconnected: ${socket.id}, User: ${socket.data.userId}`);
    const isLast = userDisconnected(socket.data.userId, socket.id);

    // Emit offline only if last socket disconnected
    if (isLast) {
      io.emit("user_offline", { userId: socket.data.userId });
    }
  });
});


  io.engine.on("connection_error", (err) => {
    console.log("❌ Socket connection error:", err);
  });

  // Add more event listeners for debugging
  io.on("connect_error", (err) => {
    console.log("❌ Socket connect_error:", err);
  });

  io.on("disconnect", (reason) => {
    console.log("🔴 Socket disconnected:", reason);
  });
}