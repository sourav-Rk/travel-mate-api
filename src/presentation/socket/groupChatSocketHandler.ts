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
    console.log(`Registering group chat socket handlers for user: ${socket.data.userId}`);

    // Join group chat
    socket.on("join_group_chat", async (data, ack?: (res: any) => void) => {
      const startTime = Date.now();
      const requestId = Math.random().toString(36).substr(2, 9);
      
      try {
        console.log(`🚀 [${requestId}] Join group chat request:`, data);
        const { packageId } = data;
        const userId = socket.data.userId;
        const userType = socket.data.role;

        console.log(`👤 [${requestId}] User: ${userId} (${userType})`);
        console.log(`📦 [${requestId}] Package: ${packageId}`);

        // Get or create group chat for the package
        let groupChat = await this._getGroupChatByPackageUsecase.execute(packageId);
        
        if (!groupChat) {
          console.log(`🆕 [${requestId}] Creating new group chat for package: ${packageId}`);
          
          // Create group chat with current user as initial member
          groupChat = await this._createGroupChatUsecase.execute({
            packageId,
            name: `Group Chat - Package ${packageId}`,
            members: [{
              userId,
              userType: userType as "client" | "guide" | "vendor"
            }]
          });
        }

        // Join socket to the group chat room
        const roomName = `group_chat_${groupChat._id}`;
        socket.join(roomName);
        socket.data.groupChatId = groupChat._id.toString();

        console.log(`🏠 [${requestId}] ${userId} joined group chat room: ${roomName}`);

        // Notify client
        socket.emit("group_chat_joined", { 
          groupChatId: groupChat._id,
          packageId: groupChat.packageId,
          name: groupChat.name,
          members: groupChat.members
        });

        const duration = Date.now() - startTime;
        console.log(`⏱️ [${requestId}] Join group chat completed in ${duration}ms`);

        if (ack) {
          ack({ success: true, groupChatId: groupChat._id });
        }
      } catch (err) {
        const duration = Date.now() - startTime;
        console.error(`❌ [${requestId}] Error in join_group_chat after ${duration}ms:`, err);
        socket.emit("group_chat_error", { message: "Failed to join group chat" });
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
        console.log(`💬 [${requestId}] Send group message request:`, data);
        
        const {
          groupChatId,
          message,
        } = data;

        const senderId = socket.data.userId;
        const senderType = socket.data.role;

        if (!groupChatId || !message || !senderId || !senderType) {
          console.error(`❌ [${requestId}] Missing message data:`, data);
          return ack?.({ success: false, error: "Missing message data" });
        }

        const groupMessage = await this._sendGroupMessageUsecase.execute({
          groupChatId,
          senderId,
          senderType: senderType as "client" | "guide" | "vendor",
          message
        });

        console.log(`💬 [${requestId}] New group message created:`, groupMessage);

        // Emit to all members in the group chat room
        const roomName = `group_chat_${groupChatId}`;
        io.to(roomName).emit("new_group_message", groupMessage);
        console.log(`✅ [${requestId}] Group message emitted to room ${roomName}`);

        const duration = Date.now() - startTime;
        console.log(`⏱️ [${requestId}] Send group message completed in ${duration}ms`);

        ack?.({ success: true, message: groupMessage });
      } catch (err: any) {
        const duration = Date.now() - startTime;
        console.error(`❌ [${requestId}] send_group_message error after ${duration}ms:`, err);
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
        console.log(`📜 [${requestId}] Get group messages request:`, data);
        
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

        console.log(`📜 [${requestId}] Retrieved ${messages.length} group messages`);

        const duration = Date.now() - startTime;
        console.log(`⏱️ [${requestId}] Get group messages completed in ${duration}ms`);

        ack?.({ success: true, messages });
      } catch (err: any) {
        const duration = Date.now() - startTime;
        console.error(`❌ [${requestId}] get_group_messages error after ${duration}ms:`, err);
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
          
          console.log(`👋 User ${userId} left group chat room: ${roomName}`);
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
    socket.on("group_chat_start_typing", async ({ groupChatId, userId }, ack?: (res: any) => void) => {
      try {
        if (!groupChatId || !userId) {
          console.error("Missing data for group_chat_start_typing");
          return;
        }
        
        console.log(`${userId} started typing in group chat ${groupChatId}`);
        
        const roomName = `group_chat_${groupChatId}`;
        socket.to(roomName).emit("group_chat_user_typing", { userId, groupChatId });

        if (ack) ack({ success: true });
      } catch (error: any) {
        console.error("group_chat_start_typing error:", error);
        if (ack) ack({ success: false, error: "Failed to start typing" });
      }
    });

    socket.on("group_chat_stop_typing", async ({ groupChatId, userId }, ack?) => {
      try {
        if (!groupChatId || !userId) {
          console.error("Missing data for group_chat_stop_typing");
          return;
        }
        
        console.log(`${userId} stopped typing in group chat ${groupChatId}`);

        const roomName = `group_chat_${groupChatId}`;
        socket.to(roomName).emit("group_chat_user_stopped_typing", { userId, groupChatId });

        if (ack) ack({ success: true });
      } catch (error: any) {
        console.error("group_chat_stop_typing error:", error);
        if (ack) ack({ success: false, error: "Failed to stop typing" });
      }
    });

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
