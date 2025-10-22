import { inject, injectable } from "tsyringe";
import { Server, Socket } from "socket.io";
import { ISendGroupMessageUsecase } from "../../application/usecase/interfaces/group-chat/send-group-message-usecase.interface";
import { ICreateGroupChatUsecase } from "../../application/usecase/interfaces/group-chat/create-group-chat-usecase.interface";
import { IGetGroupChatByPackageUsecase } from "../../application/usecase/interfaces/group-chat/get-group-chat-by-package-usecase.interface";
import { IGetGroupMessagesUsecase } from "../../application/usecase/interfaces/group-chat/get-group-messages-usecase.interface";
import { IGroupChatSocketHandler } from "../interfaces/socket/group-chat-socket-handler.interface";
import {
  getOnlineUsers,
  isUserOnline,
  userConnected,
  userDisconnected,
} from "../../infrastructure/config/socket/onlineUsers";

@injectable()
export class GroupChatSocketHandler implements IGroupChatSocketHandler {
  constructor(
    @inject("ISendGroupMessageUsecase")
    private _sendGroupMessageUsecase: ISendGroupMessageUsecase,

    @inject("ICreateGroupChatUsecase")
    private _createGroupChatUsecase: ICreateGroupChatUsecase,

    @inject("IGetGroupChatByPackageUsecase")
    private _getGroupChatByPackageUsecase: IGetGroupChatByPackageUsecase,

    @inject("IGetGroupMessagesUsecase")
    private _getGroupMessagesUsecase: IGetGroupMessagesUsecase
  ) {}

  register(io: Server, socket: Socket): void {
    console.log(
      `Registering group chat socket handlers for user: ${socket.data.userId}`
    );

    // Join group chat
    socket.on("join_group_chat", async (data, ack?: (res: any) => void) => {
      const startTime = Date.now();
      const requestId = Math.random().toString(36).substr(2, 9);

      try {
        const { packageId } = data;
        const userId = socket.data.userId;
        const userType = socket.data.role;

        let groupChat = await this._getGroupChatByPackageUsecase.execute(
          packageId
        );

        if (!groupChat) {
          groupChat = await this._createGroupChatUsecase.execute({
            packageId,
            name: `Group Chat - Package ${packageId}`,
            members: [
              {
                userId,
                userType: userType as "client" | "guide" | "vendor",
              },
            ],
          });
        }

        const roomName = `group_chat_${groupChat._id}`;
        socket.join(roomName);
        socket.data.groupChatId = groupChat._id.toString();

        // Notify client
        socket.emit("group_chat_joined", {
          groupChatId: groupChat._id,
          packageId: groupChat.packageId,
          name: groupChat.name,
          members: groupChat.members,
        });

        const duration = Date.now() - startTime;

        if (ack) {
          ack({ success: true, groupChatId: groupChat._id });
        }
      } catch (err) {
        const duration = Date.now() - startTime;
        socket.emit("group_chat_error", {
          message: "Failed to join group chat",
        });
        if (ack) {
          ack({ success: false, error: "Failed to join group chat" });
        }
      }
    });

    // Send group message
    socket.on("send_group_message", async (data, ack?: (res: any) => void) => {
      const startTime = Date.now();
      const requestId = Math.random().toString(36).substr(2, 9);

      try {
        const { groupChatId, message } = data;

        const senderId = socket.data.userId;
        const senderType = socket.data.role;

        if (!groupChatId || !message || !senderId || !senderType) {
          return ack?.({ success: false, error: "Missing message data" });
        }

        const groupMessage = await this._sendGroupMessageUsecase.execute({
          groupChatId,
          senderId,
          senderType: senderType as "client" | "guide" | "vendor",
          message,
        });

        console.log(
          `💬 [${requestId}] New group message created:`,
          groupMessage
        );

        // Emit to all members in the group chat room
        const roomName = `group_chat_${groupChatId}`;
        io.to(roomName).emit("new_group_message", groupMessage);

        const duration = Date.now() - startTime;

        ack?.({ success: true, message: groupMessage });
      } catch (err: any) {
        const duration = Date.now() - startTime;

        ack?.({
          success: false,
          error: err.message || "Internal server error",
        });
      }
    });

    // Get group messages
    socket.on("get_group_messages", async (data, ack?: (res: any) => void) => {
      const startTime = Date.now();
      const requestId = Math.random().toString(36).substr(2, 9);

      try {
        const { groupChatId, limit = 20, before } = data;

        if (!groupChatId) {
          console.error(`❌ [${requestId}] Missing groupChatId`);
          return ack?.({ success: false, error: "Missing groupChatId" });
        }

        const messages = await this._getGroupMessagesUsecase.execute(
          groupChatId,
          limit,
          before
        );

        const duration = Date.now() - startTime;

        ack?.({ success: true, messages });
      } catch (err: any) {
        const duration = Date.now() - startTime;

        ack?.({
          success: false,
          error: err.message || "Internal server error",
        });
      }
    });

    // Leave group chat
    socket.on("leave_group_chat", async (data, ack?: (res: any) => void) => {
      try {
        const { groupChatId } = data;
        const userId = socket.data.userId;

        if (groupChatId) {
          const roomName = `group_chat_${groupChatId}`;
          socket.leave(roomName);
          socket.data.groupChatId = null;
        }

        if (ack) {
          ack({ success: true });
        }
      } catch (err) {
        console.error("Error in leave_group_chat:", err);
        if (ack) {
          ack({ success: false, error: "Failed to leave group chat" });
        }
      }
    });

    // Group chat typing indicators
    socket.on(
      "group_chat_start_typing",
      async ({ groupChatId, userId }, ack?: (res: any) => void) => {
        try {
          if (!groupChatId || !userId) {
            console.error("Missing data for group_chat_start_typing");
            return;
          }

          console.log(`${userId} started typing in group chat ${groupChatId}`);

          const roomName = `group_chat_${groupChatId}`;
          socket
            .to(roomName)
            .emit("group_chat_user_typing", { userId, groupChatId });

          if (ack) ack({ success: true });
        } catch (error: any) {
          console.error("group_chat_start_typing error:", error);
          if (ack) ack({ success: false, error: "Failed to start typing" });
        }
      }
    );

    socket.on(
      "group_chat_stop_typing",
      async ({ groupChatId, userId }, ack?) => {
        try {
          if (!groupChatId || !userId) {
            console.error("Missing data for group_chat_stop_typing");
            return;
          }

          console.log(`${userId} stopped typing in group chat ${groupChatId}`);

          const roomName = `group_chat_${groupChatId}`;
          socket
            .to(roomName)
            .emit("group_chat_user_stopped_typing", { userId, groupChatId });

          if (ack) ack({ success: true });
        } catch (error: any) {
          console.error("group_chat_stop_typing error:", error);
          if (ack) ack({ success: false, error: "Failed to stop typing" });
        }
      }
    );

    // Handle disconnect
    socket.on("disconnect", (reason) => {
      console.log(
        `🔴 Group chat socket disconnected: ${socket.id}, User: ${socket.data.userId}, Reason: ${reason}`
      );

      const userId = socket.data.userId;

      if (socket.data.groupChatId) {
        const roomName = `group_chat_${socket.data.groupChatId}`;
        socket.leave(roomName);
        console.log(`User left group chat room ${roomName} on disconnect`);
      }
    });
  }
}
