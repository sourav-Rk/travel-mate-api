import { inject, injectable } from "tsyringe";
import { IChatSocketHandler } from "../interfaces/socket/chat-socket-handler.interface";
import { Server, Socket } from "socket.io";
import { ISendMessageUseCase } from "../../application/usecase/interfaces/chat/send-message-usecase.interface";
import { IMarkReadUsecase } from "../../application/usecase/interfaces/chat/mark-read-usecase.interface";
import { ICheckChatRoomUsecase } from "../../application/usecase/interfaces/chat/check-chat-room-usecase.interface";
import {
  getOnlineUsers,
  isUserOnline,
  userConnected,
  userDisconnected,
} from "../../infrastructure/config/socket/onlineUsers";
import { IMarkAsDeliveredUsecase } from "../../application/usecase/interfaces/chat/mark-delivered-usecase.interface";

@injectable()
export class ChatSocketHandler implements IChatSocketHandler {
  constructor(
    @inject("ICheckChatRoomUsecase")
    private _checkChatRoomUsecase: ICheckChatRoomUsecase,

    @inject("ISendMessageUseCase")
    private _sendMessageUsecase: ISendMessageUseCase,

    @inject("IMarkReadUsecase")
    private _markReadUsecase: IMarkReadUsecase,

    @inject("IMarkAsDeliveredUsecase")
    private _markAsDeliveredUsecase: IMarkAsDeliveredUsecase
  ) {}

  register(io: Server, socket: Socket): void {
    console.log(` Registering socket handlers for user: ${socket.data.userId}`);

    const isFirstConnection = userConnected(socket.data.userId, socket.id);
    if (isFirstConnection) {
      io.emit("user_online", { userId: socket.data.userId });
    }

    socket.on("check_online_status", ({ userId }, callback) => {
      try {
        const isOnline = isUserOnline(userId);
        callback({ isOnline });
      } catch (error) {
        console.error("Error checking online status:", error);
        callback({ isOnline: false });
      }
    });

    socket.on("get_online_users", (callback) => {
      try {
        const onlineUsers = getOnlineUsers();
        callback(onlineUsers);
      } catch (error) {
        console.error("Error getting online users:", error);
        callback([]);
      }
    });

    socket.on("start_chat", async (data, ack?: (res: any) => void) => {
      const startTime = Date.now();
      const requestId = Math.random().toString(36).substr(2, 9);
      
      try {
        const { receiverId, receiverType, contextType, contextId } = data;
        const senderId = socket.data.userId;
        const senderType = socket.data.role;

        const participants = [
          { userId: senderId, userType: senderType },
          { userId: receiverId, userType: receiverType },
        ];

        // Check for existing rooms
        let chatroom = await this._checkChatRoomUsecase.execute(
          participants,
          contextType,
          contextId
        );
        socket.data.chatRoomId = chatroom?._id.toString();

        // Join user to the room
        socket.join(chatroom?._id.toString()!);

        // Notify client
        socket.emit("chat_joined", { chatRoomId: chatroom?._id });


        if (ack) {
          ack({ success: true, chatRoomId: chatroom?._id });
        }
      } catch (err) {
        socket.emit("error", { message: "failed to start chat" });
        if (ack) {
          ack({ success: false, error: "Failed to start chat" });
        }
      }
    });

    socket.on("send_message", async (data, ack?: (res: any) => void) => {
      try {
        console.log("Send message request:", data);

        const {
          chatRoomId,
          senderId,
          senderType,
          receiverId,
          receiverType,
          message,
          contextType,
          contextId,
        } = data;

        if (
          !senderId ||
          !receiverId ||
          !message ||
          !senderType ||
          !receiverType ||
          !contextType
        ) {
          console.error("Missing message data:", data);
          return ack?.({ success: false, error: "Missing message data" });
        }

        const newMessage = await this._sendMessageUsecase.execute({
          chatRoomId,
          senderId,
          senderType,
          receiverId,
          receiverType,
          message,
          contextType,
          contextId,
        });

        console.log(`💬 New message created:`, newMessage);

        // Check if receiver is online
        const isReceiverOnline = isUserOnline(receiverId);
        console.log(`Receiver ${receiverId} online: ${isReceiverOnline}`);

        if (isReceiverOnline) {
          try {
            await this._markAsDeliveredUsecase.execute(chatRoomId, receiverId);
            newMessage.status = "delivered";
            console.log(` Message marked as delivered for ${receiverId}`);
          } catch (deliveryError) {
            console.error(" Error marking as delivered:", deliveryError);
          }
        }


        io.to(newMessage.chatRoomId).emit("new_message", newMessage);


        ack?.({ success: true, message: newMessage });
      } catch (err: any) {
        console.error("send_message error:", err);
        ack?.({
          success: false,
          error: "Internal server error",
        });
      }
    });

    socket.on("mark_messages_delivered", async (data, ack?) => {
      try {
        const { chatRoomId, userId } = data;

        if (!chatRoomId || !userId) {
          console.error(" Missing data for mark_messages_delivered:", data);
          return ack?.({ success: false, error: "Missing data" });
        }

        const result = await this._markAsDeliveredUsecase.execute(
          chatRoomId,
          userId
        );

        socket.to(chatRoomId).emit("messages_delivered", {
          chatRoomId,
          userId,
          deliveredAt: new Date(),
          messageIds: result.messageIds,
        });

        ack?.({ success: true });
      } catch (error) {
        console.error("mark_messages_delivered error:", error);
        ack?.({
          success: false,
          error: "Failed to mark messages as delivered",
        });
      }
    });

    // MARK MESSAGES AS READ
    socket.on("mark_messages_read", async (data, ack?) => {
      try {
        const { chatRoomId, userId } = data;

        if (!chatRoomId || !userId) {
          console.error("Missing data for mark_messages_read:", data);
          return ack?.({ success: false, error: "Missing data" });
        }


        const result = await this._markReadUsecase.execute(chatRoomId, userId);
        socket.to(chatRoomId).emit("messages_read", {
          chatRoomId,
          userId,
          readAt: new Date(),
          messageIds: result.messageIds,
        });

        ack?.({ success: true });
      } catch (error) {
        console.error(" mark_messages_read error:", error);
        ack?.({ success: false, error: "Failed to mark messages as read" });
      }
    });

    // START TYPING EVENT
    socket.on(
      "start_typing",
      async ({ chatRoomId, userId }, ack?: (res: any) => void) => {
        try {
          if (!chatRoomId || !userId) {
            console.error("Missing data for start_typing");
            return;
          }
          console.log(`${userId} started typing in room ${chatRoomId}`);

          socket.to(chatRoomId).emit("user_typing", { userId, chatRoomId });

          if (ack) ack({ success: true });
        } catch (error: any) {
          console.error("start_typing error:", error);
          if (ack) ack({ success: false, error: "Failed to start typing" });
        }
      }
    );

    // STOP TYPING EVENT
    socket.on("stop_typing", async ({ chatRoomId, userId }, ack?) => {
      try {
        if (!chatRoomId || !userId) {
          console.error("Missing data for stop_typing");
          return;
        }


        socket
          .to(chatRoomId)
          .emit("user_stopped_typing", { userId, chatRoomId });

        if (ack) ack({ success: true });
      } catch (error: any) {
        console.error("stop_typing_error:", error);
        if (ack) ack({ success: false, error: "Failed to stop typing" });
      }
    });

    // DISCONNECT HANDLER
    socket.on("disconnect", (reason) => {
      console.log(
        `🔴 Socket disconnected: ${socket.id}, User: ${socket.data.userId}, Reason: ${reason}`
      );

      const userId = socket.data.userId;

      if (socket.data.chatRoomId) {
        socket.leave(socket.data.chatRoomId);
        console.log(
          `User left room ${socket.data.chatRoomId} on disconnect`
        );
      }

      const isLastConnection = userDisconnected(userId, socket.id);

      if (isLastConnection) {
        console.log(
          `User ${userId} is now offline (last socket disconnected)`
        );
        io.emit("user_offline", { userId });
      } else {
        console.log(`🔵 User ${userId} still has other connections`);
      }
    });

    // CONNECT HANDLER (for reconnections)

    socket.on("connect", () => {
      console.log(
        `🟢 Socket reconnected: ${socket.id}, User: ${socket.data.userId}`
      );

      const userId = socket.data.userId;
      const isFirstConnection = userConnected(userId, socket.id);

      if (isFirstConnection) {
        console.log(`User ${userId} is now online (first socket connection)`);
        io.emit("user_online", { userId });
      } else {
        console.log(`🔵 User ${userId} reconnected, already online`);
      }
    });
  }
}
