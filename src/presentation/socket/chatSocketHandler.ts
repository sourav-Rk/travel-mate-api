import { Server, Socket } from "socket.io";
import { inject, injectable } from "tsyringe";

import { GuideSendMessageDto } from "../../application/dto/request/guide-chat.dto";
import { ICheckChatRoomUsecase } from "../../application/usecase/interfaces/chat/check-chat-room-usecase.interface";
import { IMarkAsDeliveredUsecase } from "../../application/usecase/interfaces/chat/mark-delivered-usecase.interface";
import { IMarkReadUsecase } from "../../application/usecase/interfaces/chat/mark-read-usecase.interface";
import { ISendMessageUseCase } from "../../application/usecase/interfaces/chat/send-message-usecase.interface";
import { ICreateGuideChatRoomUsecase } from "../../application/usecase/interfaces/guide-chat/create-guide-chat-room.interface";
import { IMarkGuideMessagesDeliveredUsecase } from "../../application/usecase/interfaces/guide-chat/mark-guide-messages-delivered.interface";
import { IMarkGuideMessagesReadUsecase } from "../../application/usecase/interfaces/guide-chat/mark-guide-messages-read.interface";
import { ISendGuideMessageUsecase } from "../../application/usecase/interfaces/guide-chat/send-guide-message.interface";
import { IMessageEntity } from "../../domain/entities/message.entity";
import { IGuideChatRoomRepository } from "../../domain/repositoryInterfaces/guide-chat/guide-chat-room-repository.interface";
import {
  getOnlineUsers,
  isUserOnline,
  userConnected,
  userDisconnected,
} from "../../infrastructure/config/socket/onlineUsers";
import { ERROR_MESSAGE } from "../../shared/constants";
import { CHAT_SOCKET_EVENTS } from "../../shared/socket-events-constants";
import { getErrorMessage } from "../../shared/utils/error-handler";
import { IChatSocketHandler } from "../interfaces/socket/chat-socket-handler.interface";

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
    private _markAsDeliveredUsecase: IMarkAsDeliveredUsecase,

    @inject("ICreateGuideChatRoomUsecase")
    private _createGuideChatRoomUsecase: ICreateGuideChatRoomUsecase,

    @inject("ISendGuideMessageUsecase")
    private _sendGuideMessageUsecase: ISendGuideMessageUsecase,

    @inject("IMarkGuideMessagesDeliveredUsecase")
    private _markGuideMessagesDeliveredUsecase: IMarkGuideMessagesDeliveredUsecase,

    @inject("IMarkGuideMessagesReadUsecase")
    private _markGuideMessagesReadUsecase: IMarkGuideMessagesReadUsecase,

    @inject("IGuideChatRoomRepository")
    private _guideChatRoomRepository: IGuideChatRoomRepository
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
      CHAT_SOCKET_EVENTS.CLIENT.GUIDE_SERVICE_START_CHAT,
      async (
        data,
        ack?: (res: {
          success: boolean;
          guideChatRoomId?: string;
          error?: string;
        }) => void
      ) => {
        try {
         /**
          *  Prevent guides from initiating chat - only travellers (clients) can start guide chats
          * This prevents guides from accidentally creating self-chat rooms
          */
          if (socket.data.role === "guide") {
            return ack?.({
              success: false,
              error: ERROR_MESSAGE.GUIDE_CHAT.SELF_CHAT_NOT_ALLOWED,
            });
          }

          const travellerId =
            data.travellerId && data.travellerId.length > 0
              ? data.travellerId
              : socket.data.role === "client"
              ? socket.data.userId
              : undefined;

          const guideId =
            data.guideId && data.guideId.length > 0
              ? data.guideId
              : socket.data.role === "guide"
              ? socket.data.userId
              : undefined;

          if (!travellerId || !guideId) {
            return ack?.({
              success: false,
              error: ERROR_MESSAGE.GROUP.MISSING_MESSAGE_DATA,
            });
          }

          if (travellerId === guideId) {
            return ack?.({
              success: false,
              error: ERROR_MESSAGE.GUIDE_CHAT.SELF_CHAT_NOT_ALLOWED,
            });
          }

          const room = await this._createGuideChatRoomUsecase.execute({
            travellerId,
            guideId,
            context: {
              guideProfileId: data.guideProfileId,
              postId: data.postId,
              bookingId: data.bookingId,
            },
          });

          socket.join(room._id);
          socket.emit(CHAT_SOCKET_EVENTS.SERVER.GUIDE_SERVICE_CHAT_READY, {
            guideChatRoomId: room._id,
          });

          ack?.({
            success: true,
            guideChatRoomId: room._id,
          });
        } catch (error) {
          ack?.({
            success: false,
            error: getErrorMessage(error, ERROR_MESSAGE.SERVER_ERROR),
          });
        }
      }
    );

    socket.on(
      CHAT_SOCKET_EVENTS.CLIENT.GUIDE_SERVICE_JOIN_ROOM,
      async (
        data: { guideChatRoomId: string },
        ack?: (res: { success: boolean; error?: string }) => void
      ) => {
        try {
          if (!data.guideChatRoomId) {
            return ack?.({
              success: false,
              error: ERROR_MESSAGE.GROUP.MISSING_MESSAGE_DATA,
            });
          }

          /**
           * Verify the user is a participant in this room
           */
          const room = await this._guideChatRoomRepository.findById(data.guideChatRoomId);
          if (!room) {
            return ack?.({
              success: false,
              error: "Chat room not found",
            });
          }

          const isParticipant = room.participants.some(
            (participant) => participant.userId === socket.data.userId
          );

          if (!isParticipant) {
            return ack?.({
              success: false,
              error: "You are not a participant in this chat room",
            });
          }

          socket.join(data.guideChatRoomId);
          ack?.({ success: true });
        } catch (error) {
          ack?.({
            success: false,
            error: getErrorMessage(error, ERROR_MESSAGE.SERVER_ERROR),
          });
        }
      }
    );

    socket.on(
      CHAT_SOCKET_EVENTS.CLIENT.GUIDE_SERVICE_SEND_MESSAGE,
      async (
        data: GuideSendMessageDto,
        ack?: (res: { success: boolean; error?: string }) => void
      ) => {
        try {
          const message = await this._sendGuideMessageUsecase.execute(data);
          io
            .to(message.guideChatRoomId)
            .emit(
              CHAT_SOCKET_EVENTS.SERVER.GUIDE_SERVICE_NEW_MESSAGE,
              message
            );
          ack?.({ success: true });
        } catch (error) {
          ack?.({
            success: false,
            error: getErrorMessage(error, ERROR_MESSAGE.SERVER_ERROR),
          });
        }
      }
    );

    socket.on(
      CHAT_SOCKET_EVENTS.CLIENT.GUIDE_SERVICE_MARK_DELIVERED,
      async (
        data: { guideChatRoomId: string; userId: string },
        ack?: (res: { success: boolean; error?: string }) => void
      ) => {
        try {
          const messageIds = await this._markGuideMessagesDeliveredUsecase.execute(
            data.guideChatRoomId,
            data.userId
          );

          socket
            .to(data.guideChatRoomId)
            .emit(
              CHAT_SOCKET_EVENTS.SERVER.GUIDE_SERVICE_MESSAGES_DELIVERED,
              {
                guideChatRoomId: data.guideChatRoomId,
                userId: data.userId,
                messageIds,
              }
            );

          ack?.({ success: true });
        } catch (error) {
          ack?.({
            success: false,
            error: ERROR_MESSAGE.GROUP.FAILED_TO_MARK_MESSAGE_DELIVERED,
          });
        }
      }
    );

    socket.on(
      CHAT_SOCKET_EVENTS.CLIENT.GUIDE_SERVICE_MARK_READ,
      async (
        data: { guideChatRoomId: string; userId: string },
        ack?: (res: { success: boolean; error?: string }) => void
      ) => {
        try {
          const messageIds = await this._markGuideMessagesReadUsecase.execute(
            data.guideChatRoomId,
            data.userId
          );

          socket
            .to(data.guideChatRoomId)
            .emit(CHAT_SOCKET_EVENTS.SERVER.GUIDE_SERVICE_MESSAGES_READ, {
              guideChatRoomId: data.guideChatRoomId,
              userId: data.userId,
              messageIds,
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
          const chatroom = await this._checkChatRoomUsecase.execute(
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
            mediaAttachments,
            contextType,
            contextId,
          } = data;

          if (
            !senderId ||
            !receiverId ||
            (!message && (!mediaAttachments || mediaAttachments.length === 0)) ||
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
            message: message || "",
            mediaAttachments,
            contextType,
            contextId,
          });

          // Log for debugging
          console.log("📤 Message saved:", {
            _id: newMessage._id,
            message: newMessage.message,
            messageType: newMessage.messageType,
            mediaAttachmentsCount: newMessage.mediaAttachments?.length || 0,
            mediaAttachments: newMessage.mediaAttachments,
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
            } catch (deliveryError) {
              console.log(deliveryError)
            }
          }

          // Ensure mediaAttachments are included when emitting
          const messageToEmit = {
            ...newMessage,
            mediaAttachments: newMessage.mediaAttachments || [],
            messageType: newMessage.messageType || "text",
          };

          io.to(newMessage.chatRoomId).emit(
            CHAT_SOCKET_EVENTS.SERVER.NEW_MESSAGE,
            messageToEmit
          );

          ack?.({ success: true, message: messageToEmit });
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
