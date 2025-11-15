import { Server, Socket } from "socket.io";
import { inject, injectable } from "tsyringe";

import { IGetGroupChatByPackageUsecase } from "../../application/usecase/interfaces/group-chat/get-group-chat-by-package-usecase.interface";
import { IGetGroupMessagesUsecase } from "../../application/usecase/interfaces/group-chat/get-group-messages-usecase.interface";
import { ISendGroupMessageUsecase } from "../../application/usecase/interfaces/group-chat/send-group-message-usecase.interface";
import { IGroupMessageEntity } from "../../domain/entities/group-message.entity";
import { ERROR_MESSAGE } from "../../shared/constants";
import { GROUP_CHAT_SOCKET_EVENTS } from "../../shared/socket-events-constants";
import { getErrorMessage } from "../../shared/utils/error-handler";
import { IGroupChatSocketHandler } from "../interfaces/socket/group-chat-socket-handler.interface";

@injectable()
export class GroupChatSocketHandler implements IGroupChatSocketHandler {
  constructor(
    @inject("ISendGroupMessageUsecase")
    private _sendGroupMessageUsecase: ISendGroupMessageUsecase,

    @inject("IGetGroupChatByPackageUsecase")
    private _getGroupChatByPackageUsecase: IGetGroupChatByPackageUsecase,

    @inject("IGetGroupMessagesUsecase")
    private _getGroupMessagesUsecase: IGetGroupMessagesUsecase
  ) {}

  private getRoomName(groupChatId: string): string {
    return `group_chat_${groupChatId}`;
  }

  register(io: Server, socket: Socket): void {
    console.log(
      `Registering group chat socket handlers for user: ${socket.data.userId}`
    );

    // Join group chat
    socket.on(
      GROUP_CHAT_SOCKET_EVENTS.CLIENT.JOIN_GROUP_CHAT,
      async (
        data,
        ack?: (res: {
          success: boolean;
          groupChatId?: string;
          error?: string;
        }) => void
      ) => {
        const startTime = Date.now();

        try {
          const { packageId } = data;
          const senderId = socket.data.userId;

          const groupChat = await this._getGroupChatByPackageUsecase.execute(
            packageId
          );

          if (!groupChat) {
            socket.emit(GROUP_CHAT_SOCKET_EVENTS.SERVER.GROUP_CHAT_ERROR, {
              message: ERROR_MESSAGE.GROUP.NO_GROUP_CHAT,
            });
            if (ack) {
              ack({ success: false, error: ERROR_MESSAGE.GROUP.NO_GROUP_CHAT });
            }
            return;
          }

          const roomName = this.getRoomName(groupChat._id.toString());
          socket.join(roomName);
          socket.data.groupChatId = groupChat._id.toString();

          // Log room join for debugging
          const room = io.sockets.adapter.rooms.get(roomName);
          const roomSize = room ? room.size : 0;
          console.log(`✅ User ${senderId} joined room: ${roomName}, Total members: ${roomSize}`);

          // Notify other users in the room that a new user joined
          socket.to(roomName).emit(GROUP_CHAT_SOCKET_EVENTS.SERVER.USER_JOINED_GROUP, {
            userId: socket.data.userId,
            userType: socket.data.role,
            groupChatId: groupChat._id.toString(),
            timestamp: new Date(),
          });

          socket.emit(GROUP_CHAT_SOCKET_EVENTS.SERVER.GROUP_CHAT_JOINED, {
            groupChatId: groupChat._id,
            packageId: groupChat.packageId,
            name: groupChat.name,
            members: groupChat.members,
          });

          if (ack) {
            ack({ success: true, groupChatId: groupChat._id });
          }
        } catch (err: unknown) {
          const duration = Date.now() - startTime;
          socket.emit(GROUP_CHAT_SOCKET_EVENTS.SERVER.GROUP_CHAT_ERROR, {
            message: ERROR_MESSAGE.GROUP.FAILED_TO_JOIN_GROUP_CHAT,
          });
          if (ack) {
            ack({
              success: false,
              error: ERROR_MESSAGE.GROUP.FAILED_TO_JOIN_GROUP_CHAT,
            });
          }
        }
      }
    );

    // Send group message
    socket.on(
      GROUP_CHAT_SOCKET_EVENTS.CLIENT.SEND_GROUP_MESSAGE,
      async (
        data,
        ack?: (res: {
          success: boolean;
          message?: IGroupMessageEntity;
          error?: string;
        }) => void
      ) => {
        try {
          const { groupChatId, message, mediaAttachments } = data;

          const senderId = socket.data.userId;
          const senderType = socket.data.role;

          const hasText = message && message.trim().length > 0;
          const hasMedia = mediaAttachments && mediaAttachments.length > 0;

          if (!groupChatId || (!hasText && !hasMedia) || !senderId || !senderType) {
            return ack?.({
              success: false,
              error: ERROR_MESSAGE.GROUP.MISSING_MESSAGE_DATA,
            });
          }

          const groupMessage = await this._sendGroupMessageUsecase.execute({
            groupChatId,
            senderId,
            senderType: senderType as "client" | "guide" | "vendor",
            message: message || "",
            mediaAttachments,
          });


          const messageToEmit = {
            _id: String(groupMessage._id || ""),
            groupChatId: String(groupMessage.groupChatId || groupChatId),
            senderId: String(groupMessage.senderId || senderId),
            senderType: groupMessage.senderType,
            senderName: (groupMessage as any).senderName || "Unknown",
            message: groupMessage.message || "",
            mediaAttachments: groupMessage.mediaAttachments || [],
            messageType: groupMessage.messageType || "text",
            status: groupMessage.status || "sent",
            createdAt: groupMessage.createdAt || new Date(),
            updatedAt: groupMessage.updatedAt || new Date(),
          };


          const roomName = this.getRoomName(groupChatId);

          if (!socket.rooms.has(roomName)) {
            console.log(`Sender not in room ${roomName}, joining now..`);
            socket.join(roomName);
            socket.data.groupChatId = groupChatId;
          }

          const room = io.sockets.adapter.rooms.get(roomName);
          const roomSize = room ? room.size : 0;

          io.to(roomName).emit(
            GROUP_CHAT_SOCKET_EVENTS.SERVER.NEW_GROUP_MESSAGE,
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

    // Get group messages
    socket.on(
      GROUP_CHAT_SOCKET_EVENTS.CLIENT.GET_GROUP_MESSAGES,
      async (
        data,
        ack?: (res: {
          success: boolean;
          messages?: IGroupMessageEntity[];
          error?: string;
        }) => void
      ) => {
        try {
          const { groupChatId } = data;

          if (!groupChatId) {
            return ack?.({
              success: false,
              error: ERROR_MESSAGE.GROUP.MISSING_GROUP_CHAT_ID,
            });
          }

          const messages = await this._getGroupMessagesUsecase.execute(
            groupChatId
          );

          ack?.({ success: true, messages });
        } catch (err: unknown) {
          ack?.({
            success: false,
            error: getErrorMessage(err, ERROR_MESSAGE.SERVER_ERROR),
          });
        }
      }
    );

    // Leave group chat
    socket.on(
      GROUP_CHAT_SOCKET_EVENTS.CLIENT.LEAVE_GROUP_CHAT,
      async (
        data,
        ack?: (res: { success: boolean; error?: string }) => void
      ) => {
        try {
          const { groupChatId } = data;

          if (groupChatId) {
            const roomName = this.getRoomName(groupChatId);
            
            // Notify other users in the room that this user left
            socket.to(roomName).emit(GROUP_CHAT_SOCKET_EVENTS.SERVER.USER_LEFT_GROUP, {
              userId: socket.data.userId,
              userType: socket.data.role,
              groupChatId: groupChatId,
              timestamp: new Date(),
            });

            socket.leave(roomName);
            socket.data.groupChatId = null;
            
            console.log(`👋 User ${socket.data.userId} left room: ${roomName}`);
          }

          if (ack) {
            ack({ success: true });
          }
        } catch (err) {
          if (ack) {
            ack({
              success: false,
              error: ERROR_MESSAGE.GROUP.FAILED_TO_LEAVE_GROUP_CHAT,
            });
          }
        }
      }
    );

    // Group chat typing indicators
    socket.on(
      GROUP_CHAT_SOCKET_EVENTS.CLIENT.GROUP_CHAT_START_TYPING,
      async (
        { groupChatId, userId },
        ack?: (res: { success: boolean; error?: string }) => void
      ) => {
        try {
          if (!groupChatId || !userId) {
            return ack?.({
              success: false,
              error: ERROR_MESSAGE.GROUP.MISSING_REQUIRED_DATA,
            });
          }

          const roomName = this.getRoomName(groupChatId);

          socket
            .to(roomName)
            .emit(GROUP_CHAT_SOCKET_EVENTS.SERVER.GROUP_CHAT_USER_TYPING, {
              userId,
              groupChatId,
              timestamp: new Date(),
            });

          if (ack) ack({ success: true });
        } catch (error: unknown) {
          if (ack)
            ack({
              success: false,
              error: ERROR_MESSAGE.GROUP.FAILED_TO_START_TYPING,
            });
        }
      }
    );

    socket.on(
      GROUP_CHAT_SOCKET_EVENTS.CLIENT.GROUP_CHAT_STOP_TYPING,
      async (
        { groupChatId, userId },
        ack?: (res: { success: boolean; error?: string }) => void
      ) => {
        try {
          if (!groupChatId || !userId) {
            return ack?.({
              success: false,
              error: ERROR_MESSAGE.REQUIRED_FIELDS_MISSING,
            });
          }

          const roomName = this.getRoomName(groupChatId);

          socket
            .to(roomName)
            .emit(
              GROUP_CHAT_SOCKET_EVENTS.SERVER.GROUP_CHAT_USER_STOPPED_TYPING,
              {
                userId,
                groupChatId,
                timestamp: new Date(),
              }
            );

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

    // Get online members in group chat
    socket.on(
      GROUP_CHAT_SOCKET_EVENTS.CLIENT.GET_GROUP_ONLINE_MEMBERS,
      async (
        { groupChatId },
        ack?: (res: {
          success: boolean;
          onlineMembers?: string[];
          error?: string;
        }) => void
      ) => {
        try {
          if (!groupChatId) {
            return ack?.({
              success: false,
              error: ERROR_MESSAGE.GROUP.MISSING_GROUP_CHAT_ID,
            });
          }

          const roomName = this.getRoomName(groupChatId);
          const room = io.sockets.adapter.rooms.get(roomName);
          const onlineMembers = room ? Array.from(room) : [];

          if (ack) ack({ success: true, onlineMembers });
        } catch (error: unknown) {
          if (ack)
            ack({
              success: false,
              error: ERROR_MESSAGE.GROUP.FAILED_TO_GET_ONLINE_MEMBERS,
            });
        }
      }
    );

    // Handle disconnect
    socket.on(GROUP_CHAT_SOCKET_EVENTS.SYSTEM.DISCONNECT, (reason) => {
      console.log(
        `Group chat socket disconnected: ${socket.id}, User: ${socket.data.userId}, Reason: ${reason}`
      );

      if (socket.data.groupChatId) {
        const roomName = this.getRoomName(socket.data.groupChatId);
        socket.leave(roomName);
        console.log(`User left group chat room ${roomName} on disconnect`);
      }
    });
  }
}
