import { Server, Socket } from "socket.io";
import { injectable } from "tsyringe";

import { NOTIFICATION_SOCKET_EVENTS } from "../../shared/socket-events-constants";
import { INotificationSocketHandler } from "../interfaces/socket/notification-socket-handler.interface";

@injectable()
export class NotificationSocketHandler implements INotificationSocketHandler {
  register(io: Server, socket: Socket): void {
    console.log(
      `Registering notification socket handlers for user: ${socket.data.userId}`
    );

    socket.join(`user_${socket.data.userId}`);
    console.log(
      `User ${socket.data.userId} joined notification room: user_${socket.data.userId}`
    );

    socket.on("disconnect", () => {
      console.log(
        `Notification socket disconnected: ${socket.id}, User: ${socket.data.userId}`
      );
    });
  }


  static sendNotificationToUser(
    io: Server,
    userId: string,
    notification: {
      id?: string;
      title: string;
      message: string;
      type:
        | "success"
        | "error"
        | "info"
        | "warning"
        | "message"
        | "booking"
        | "payment";
    }
  ): void {
    const notificationData = {
      id:
        notification.id ||
        `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      userId: userId,
      timestamp: new Date().toISOString(),
    };


    io.to(`user_${userId}`).emit(
      NOTIFICATION_SOCKET_EVENTS.SERVER.NEW_NOTIFICATION,
      notificationData
    );

  }

  static sendNotificationToUsers(
    io: Server,
    userIds: string[],
    notification: {
      id?: string;
      title: string;
      message: string;
      type:
        | "success"
        | "error"
        | "info"
        | "warning"
        | "message"
        | "booking"
        | "payment";
    }
  ): void {
    userIds.forEach((userId) => {
      this.sendNotificationToUser(io, userId, notification);
    });
  }
}
