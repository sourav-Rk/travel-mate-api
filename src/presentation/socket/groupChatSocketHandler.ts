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
          const { groupChatId, message } = data;

          const senderId = socket.data.userId;
          const senderType = socket.data.role;

          if (!groupChatId || !message || !senderId || !senderType) {
            return ack?.({
              success: false,
              error: ERROR_MESSAGE.GROUP.MISSING_MESSAGE_DATA,
            });
          }

          const groupMessage = await this._sendGroupMessageUsecase.execute({
            groupChatId,
            senderId,
            senderType: senderType as "client" | "guide" | "vendor",
            message,
          });

          const roomName = this.getRoomName(groupChatId);

          io.to(roomName).emit(
            GROUP_CHAT_SOCKET_EVENTS.SERVER.NEW_GROUP_MESSAGE,
            groupMessage
          );

          ack?.({ success: true, message: groupMessage });
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
            socket.leave(roomName);
            socket.data.groupChatId = null;
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
