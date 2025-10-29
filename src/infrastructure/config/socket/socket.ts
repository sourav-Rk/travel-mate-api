import { Server } from "socket.io";

import { ITokenService } from "../../../domain/service-interfaces/token-service.interface";
import { IChatSocketHandler } from "../../../presentation/interfaces/socket/chat-socket-handler.interface";
import { IGroupChatSocketHandler } from "../../../presentation/interfaces/socket/group-chat-socket-handler.interface";
import { socketAuthMiddleware } from "../../../presentation/middlewares/socketAuth.middleware";

import { userConnected, userDisconnected } from "./onlineUsers";
import { INotificationSocketHandler } from "../../../presentation/interfaces/socket/notification-socket-handler.interface";
import { RealTimeNotificationService } from "../../service/real-time-notification.service";
import { IRealTimeNotificationService } from "../../../domain/service-interfaces/real-time-notification-service.interface";
export function configureSocket(
  io: Server,
  chatSocketHandler: IChatSocketHandler,
  groupChatSocketHandler: IGroupChatSocketHandler,
  notificationSocketHandler: INotificationSocketHandler,
  tokenService: ITokenService,
  realTimeNotificationService: IRealTimeNotificationService
) {
  console.log("Socket configuration triggered");

  // Initialize the real-time notification service with socket.io instance
  realTimeNotificationService.setSocketIO(io);

  io.use(socketAuthMiddleware(tokenService, ["client", "guide", "vendor"]));

  io.on("connection", (socket) => {
    console.log(` Socket connected: ${socket.id}, User: ${socket.data.userId}`);

    const isFirst = userConnected(socket.data.userId, socket.id);

    if (isFirst) {
      io.emit("user_online", { userId: socket.data.userId });
    }

    console.log("Registering chat socket handler...");
    chatSocketHandler.register(io, socket);

    console.log("Registering group chat socket handler...");
    groupChatSocketHandler.register(io, socket);

    console.log("Registering notification socket handler...");
    notificationSocketHandler.register(io, socket);

    socket.on("disconnect", () => {
      console.log(
        `Socket disconnected: ${socket.id}, User: ${socket.data.userId}`
      );
      const isLast = userDisconnected(socket.data.userId, socket.id);

      if (isLast) {
        io.emit("user_offline", { userId: socket.data.userId });
      }
    });
  });

  io.engine.on("connection_error", (err) => {
    console.log("Socket connection error:", err);
  });

  io.on("connect_error", (err) => {
    console.log("Socket connect_error:", err);
  });

  io.on("disconnect", (reason) => {
    console.log("Socket disconnected:", reason);
  });
}
