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
import { CHAT_SOCKET_EVENTS } from "../../shared/socket-events-constants";
import { ERROR_MESSAGE } from "../../shared/constants";
import { IMessageEntity } from "../../domain/entities/message.entity";
import { getErrorMessage } from "../../shared/utils/error-handler";

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
      io.emit(CHAT_SOCKET_EVENTS.SERVER.USER_ONLINE, {
        userId: socket.data.userId,
      });
    }

    socket.on(
      CHAT_SOCKET_EVENTS.CLIENT.CHECK_ONLINE_STATUS,
      ({ userId }, callback) => {
        try {
          const isOnline = isUserOnline(userId);
          callback({ isOnline });
        } catch (error) {
          callback({ isOnline: false });
        }
      }
    );

    socket.on(CHAT_SOCKET_EVENTS.CLIENT.GET_ONLINE_USERS, (callback) => {
      try {
        const onlineUsers = getOnlineUsers();
        callback(onlineUsers);
      } catch (error) {
        callback([]);
      }
    });

    socket.on(
      CHAT_SOCKET_EVENTS.CLIENT.START_CHAT,
      async (
        data,
        ack?: (res: {
          success: boolean;
          chatRoomId?: string;
          error?: string;
        }) => void
      ) => {
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
          socket.emit(CHAT_SOCKET_EVENTS.SERVER.CHAT_JOINED, {
            chatRoomId: chatroom?._id,
          });

          if (ack) {
            ack({ success: true, chatRoomId: chatroom?._id });
          }
        } catch (err) {
          socket.emit(CHAT_SOCKET_EVENTS.SERVER.ERROR, {
            message: ERROR_MESSAGE.CHAT.FAILED_TO_START_CHAT,
          });
          if (ack) {
            ack({
              success: false,
              error: ERROR_MESSAGE.CHAT.FAILED_TO_START_CHAT,
            });
          }
        }
      }
    );

    socket.on(
      CHAT_SOCKET_EVENTS.CLIENT.SEND_MESSAGE,
      async (
        data,
        ack?: (res: {
          success: boolean;
          message?: IMessageEntity;
          error?: string;
        }) => void
      ) => {
        try {
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
            return ack?.({
              success: false,
              error: ERROR_MESSAGE.GROUP.MISSING_MESSAGE_DATA,
            });
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

          // Check if receiver is online
          const isReceiverOnline = isUserOnline(receiverId);

          if (isReceiverOnline) {
            try {
              await this._markAsDeliveredUsecase.execute(
                chatRoomId,
                receiverId
              );
              newMessage.status = "delivered";
            } catch (deliveryError) {}
          }

          io.to(newMessage.chatRoomId).emit(
            CHAT_SOCKET_EVENTS.SERVER.NEW_MESSAGE,
            newMessage
          );

          ack?.({ success: true, message: newMessage });
        } catch (err: unknown) {
          ack?.({
            success: false,
            error: getErrorMessage(err, ERROR_MESSAGE.SERVER_ERROR),
          });
        }
      }
    );

    socket.on(
      CHAT_SOCKET_EVENTS.CLIENT.MARK_MESSAGES_DELIVERED,
      async (data, ack?) => {
        try {
          const { chatRoomId, userId } = data;

          if (!chatRoomId || !userId) {
            return ack?.({
              success: false,
              error: ERROR_MESSAGE.GROUP.MISSING_MESSAGE_DATA,
            });
          }

          const result = await this._markAsDeliveredUsecase.execute(
            chatRoomId,
            userId
          );

          socket
            .to(chatRoomId)
            .emit(CHAT_SOCKET_EVENTS.SERVER.MESSAGES_DELIVERED, {
              chatRoomId,
              userId,
              deliveredAt: new Date(),
              messageIds: result.messageIds,
            });

          ack?.({ success: true });
        } catch (error) {
          ack?.({
            success: false,
            error: ERROR_MESSAGE.GROUP.FAILED_TO_MARK_MESSAGE_DELIVERED,
          });
        }
      }
    );

    // MARK MESSAGES AS READ
    socket.on(
      CHAT_SOCKET_EVENTS.CLIENT.MARK_MESSAGES_READ,
      async (data, ack?) => {
        try {
          const { chatRoomId, userId } = data;

          if (!chatRoomId || !userId) {
            return ack?.({
              success: false,
              error: ERROR_MESSAGE.GROUP.MISSING_MESSAGE_DATA,
            });
          }

          const result = await this._markReadUsecase.execute(
            chatRoomId,
            userId
          );
          socket.to(chatRoomId).emit(CHAT_SOCKET_EVENTS.SERVER.MESSAGES_READ, {
            chatRoomId,
            userId,
            readAt: new Date(),
            messageIds: result.messageIds,
          });

          ack?.({ success: true });
        } catch (error) {
          ack?.({
            success: false,
            error: ERROR_MESSAGE.GROUP.FAILED_TO_MARK_MESSAGE_READ,
          });
        }
      }
    );

    // START TYPING EVENT
    socket.on(
      CHAT_SOCKET_EVENTS.CLIENT.START_TYPING,
      async (
        { chatRoomId, userId },
        ack?: (res: { success: boolean; error?: string }) => void
      ) => {
        try {
          if (!chatRoomId || !userId) {
            return;
          }

          socket.to(chatRoomId).emit(CHAT_SOCKET_EVENTS.SERVER.USER_TYPING, {
            userId,
            chatRoomId,
          });

          if (ack) ack({ success: true });
        } catch (error: unknown) {
          if (ack)
            ack({
              success: false,
              error: getErrorMessage(
                error,
                ERROR_MESSAGE.GROUP.FAILED_TO_START_TYPING
              ),
            });
        }
      }
    );

    // STOP TYPING EVENT
    socket.on(
      CHAT_SOCKET_EVENTS.CLIENT.STOP_TYPING,
      async ({ chatRoomId, userId }, ack?) => {
        try {
          if (!chatRoomId || !userId) {
            return;
          }
          socket
            .to(chatRoomId)
            .emit(CHAT_SOCKET_EVENTS.SERVER.USER_STOPPED_TYPING, {
              userId,
              chatRoomId,
            });

          if (ack) ack({ success: true });
        } catch (error: unknown) {
          if (ack)
            ack({
              success: false,
              error: ERROR_MESSAGE.GROUP.FAILED_TO_STOP_TYPING,
            });
        }
      }
    );

    // DISCONNECT HANDLER
    socket.on("disconnect", (reason) => {
      console.log(
        `🔴 Socket disconnected: ${socket.id}, User: ${socket.data.userId}, Reason: ${reason}`
      );

      const userId = socket.data.userId;

      if (socket.data.chatRoomId) {
        socket.leave(socket.data.chatRoomId);
        console.log(`User left room ${socket.data.chatRoomId} on disconnect`);
      }

      const isLastConnection = userDisconnected(userId, socket.id);

      if (isLastConnection) {
        io.emit(CHAT_SOCKET_EVENTS.SERVER.USER_OFFLINE, { userId });
      } else {
        console.log(` User ${userId} still has other connections`);
      }
    });

    // CONNECT HANDLER (for reconnections)
    socket.on(CHAT_SOCKET_EVENTS.SYSTEM.CONNECT, () => {
      console.log(
        `Socket reconnected: ${socket.id}, User: ${socket.data.userId}`
      );

      const userId = socket.data.userId;
      const isFirstConnection = userConnected(userId, socket.id);

      if (isFirstConnection) {
        io.emit(CHAT_SOCKET_EVENTS.SERVER.USER_ONLINE, { userId });
      } else {
        console.log(`User ${userId} reconnected, already online`);
      }
    });
  }
}
