import { inject, injectable } from "tsyringe";
import { Server } from "socket.io";

import { INotificationRepository } from "../../domain/repositoryInterfaces/notification/notification-repository.interface";
import { IPushNotificationService } from "../../domain/service-interfaces/push-notifications.interface";
import { NotificationSocketHandler } from "../../presentation/socket/notificationSocketHandler";
import { IRealTimeNotificationService } from "../../domain/service-interfaces/real-time-notification-service.interface";

export interface NotificationData {
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
  metadata?: Record<string, unknown>;
}

@injectable()
export class RealTimeNotificationService
  implements IRealTimeNotificationService
{
  private io: Server | null = null;

  constructor(
    @inject("INotificationRepository")
    private _notificationRepository: INotificationRepository,
    @inject("IPushNotificationService")
    private _pushNotificationService: IPushNotificationService
  ) {}

  setSocketIO(io: Server): void {
    this.io = io;
  }

  async sendNotificationToUser(
    userId: string,
    notification: NotificationData,
    options: {
      saveToDatabase?: boolean;
      sendPushNotification?: boolean;
      sendRealTimeNotification?: boolean;
    } = {}
  ): Promise<void> {
    const {
      saveToDatabase = true,
      sendPushNotification = false,
      sendRealTimeNotification = true,
    } = options;

    try {
      if (saveToDatabase) {
        await this._notificationRepository.createNotification({
          userId,
          title: notification.title,
          message: notification.message,
          type: notification.type,
          isRead: false,
          createdAt: new Date(),
        });
      }

      if (sendPushNotification) {
        await this._pushNotificationService.sendNotification(
          userId,
          notification.title,
          notification.message
        );
      }

      if (sendRealTimeNotification && this.io) {
        NotificationSocketHandler.sendNotificationToUser(
          this.io,
          userId,
          notification
        );
      }
    } catch (error) {
      console.error(`Failed to send notification to user ${userId}:`, error);
      throw error;
    }
  }

  async sendNotificationToUsers(
    userIds: string[],
    notification: NotificationData,
    options: {
      saveToDatabase?: boolean;
      sendPushNotification?: boolean;
      sendRealTimeNotification?: boolean;
    } = {}
  ): Promise<void> {
    const {
      saveToDatabase = true,
      sendPushNotification = true,
      sendRealTimeNotification = true,
    } = options;

    try {
      if (saveToDatabase) {
        const notificationPromises = userIds.map((userId) =>
          this._notificationRepository.createNotification({
            userId,
            title: notification.title,
            message: notification.message,
            type: notification.type,
            isRead: false,
            createdAt: new Date(),
          })
        );
        await Promise.all(notificationPromises);
      }

      if (sendPushNotification) {
        const pushPromises = userIds.map((userId) =>
          this._pushNotificationService.sendNotification(
            userId,
            notification.title,
            notification.message
          )
        );
        await Promise.all(pushPromises);
      }

      if (sendRealTimeNotification && this.io) {
        NotificationSocketHandler.sendNotificationToUsers(
          this.io,
          userIds,
          notification
        );
      }
    } catch (error) {
      console.error(`Failed to send notification to users:`, error);
      throw error;
    }
  }

  async sendBookingNotification(
    userId: string,
    bookingData: {
      bookingId: string;
      packageName: string;
      status: string;
      amount?: number;
    },
    notificationType:
      | "applied"
      | "confirmed"
      | "cancelled"
      | "payment_required"
      | "payment_received"
      | "waitlisted"
      | "advance_pending"
      | "cancellation_requested"
  ): Promise<void> {
    let title: string;
    let message: string;
    let type: NotificationData["type"] = "booking";

    switch (notificationType) {
      case "applied":
        title = "Booking Applied";
        message = `Your booking for "${bookingData.packageName}" has been applied successfully.`;
        break;
      case "confirmed":
        title = "Booking Confirmed";
        message = `Great news! Your booking for "${bookingData.packageName}" has been confirmed.`;
        type = "success";
        break;
      case "cancelled":
        title = "Booking Cancelled";
        message = `Your booking for "${bookingData.packageName}" has been cancelled.`;
        type = "warning";
        break;
      case "payment_required":
        title = "Payment Required";
        message = `Payment of ₹${bookingData.amount} is required for your booking "${bookingData.packageName}".`;
        type = "payment";
        break;
      case "payment_received":
        title = "Payment Received";
        message = `Payment of ₹${bookingData.amount} has been received for "${bookingData.packageName}".`;
        type = "success";
        break;
      default:
        title = "Booking Update";
        message = `Your booking for "${bookingData.packageName}" has been updated.`;
    }

    await this.sendNotificationToUser(userId, {
      title,
      message,
      type,
      metadata: {
        bookingId: bookingData.bookingId,
        packageName: bookingData.packageName,
        status: bookingData.status,
        amount: bookingData.amount,
      },
    });
  }

  async sendMessageNotification(
    userId: string,
    messageData: {
      senderName: string;
      chatRoomId: string;
      messagePreview: string;
      senderId: string;
    }
  ): Promise<void> {
    await this.sendNotificationToUser(
      userId,
      {
        title: `New message from ${messageData.senderName}`,
        message: messageData.messagePreview,
        type: "message",
        metadata: {
          chatRoomId: messageData.chatRoomId,
          senderId: messageData.senderId,
          senderName: messageData.senderName,
        },
      },
      {
        saveToDatabase: false,
        sendPushNotification: false,
        sendRealTimeNotification: true,
      }
    );
  }

  async sendPaymentNotification(
    userId: string,
    paymentData: {
      amount: number;
      status: "success" | "failed" | "pending";
      transactionId?: string;
      description?: string;
    }
  ): Promise<void> {
    let title: string;
    let message: string;
    let type: NotificationData["type"] = "payment";

    switch (paymentData.status) {
      case "success":
        title = "Payment Successful";
        message = `Payment of ₹${paymentData.amount} has been processed successfully.`;
        type = "success";
        break;
      case "failed":
        title = "Payment Failed";
        message = `Payment of ₹${paymentData.amount} failed. Please try again.`;
        type = "error";
        break;
      case "pending":
        title = "Payment Pending";
        message = `Payment of ₹${paymentData.amount} is being processed.`;
        type = "warning";
        break;
    }

    await this.sendNotificationToUser(userId, {
      title,
      message,
      type,
      metadata: {
        amount: paymentData.amount,
        status: paymentData.status,
        transactionId: paymentData.transactionId,
        description: paymentData.description,
      },
    });
  }

  async sendSystemNotification(
    userId: string,
    systemData: {
      title: string;
      message: string;
      type: "info" | "warning" | "error" | "success";
    }
  ): Promise<void> {
    await this.sendNotificationToUser(userId, {
      title: systemData.title,
      message: systemData.message,
      type: systemData.type,
    });
  }
}

