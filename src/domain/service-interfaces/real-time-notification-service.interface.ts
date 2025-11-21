import { Server } from "socket.io";

import { NotificationData } from "../../infrastructure/service/real-time-notification.service";

export interface IRealTimeNotificationService {
  setSocketIO(io: Server): void;

  sendNotificationToUser(
    userId: string,
    notification: NotificationData,
    options?: {
      saveToDatabase?: boolean;
      sendPushNotification?: boolean;
      sendRealTimeNotification?: boolean;
    }
  ): Promise<void>;

  sendNotificationToUsers(
    userIds: string[],
    notification: NotificationData,
    options?: {
      saveToDatabase?: boolean;
      sendPushNotification?: boolean;
      sendRealTimeNotification?: boolean;
    }
  ): Promise<void>;

  sendBookingNotification(
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
  ): Promise<void>;

  sendMessageNotification(
    userId: string,
    messageData: {
      senderName: string;
      chatRoomId: string;
      messagePreview: string;
      senderId: string;
    }
  ): Promise<void>;

  sendPaymentNotification(
    userId: string,
    paymentData: {
      amount: number;
      status: "success" | "failed" | "pending";
      transactionId?: string;
      description?: string;
    }
  ): Promise<void>;

  sendSystemNotification(
    userId: string,
    systemData: {
      title: string;
      message: string;
      type: "info" | "warning" | "error" | "success";
    }
  ): Promise<void>;
}
