import { inject, injectable } from "tsyringe";

import {
  IMessageEntity,
  MediaAttachment,
} from "../../../../domain/entities/message.entity";
import { CustomError } from "../../../../domain/errors/customError";
import { IChatRoomRepository } from "../../../../domain/repositoryInterfaces/chatroom/chatroom-repository.interface";
import { IMessageRepository } from "../../../../domain/repositoryInterfaces/message/message-repository.interface";
import { RealTimeNotificationService } from "../../../../infrastructure/service/real-time-notification.service";
import {
  CHAT_CONTEXT_TYPE,
  CHAT_USERS,
  ERROR_MESSAGE,
  HTTP_STATUS,
} from "../../../../shared/constants";
import { ISendMessageUseCase } from "../../interfaces/chat/send-message-usecase.interface";
import { IRealTimeNotificationService } from "../../../../domain/service-interfaces/real-time-notification-service.interface";

@injectable()
export class SendMessageUsecase implements ISendMessageUseCase {
  constructor(
    @inject("IMessageRepository")
    private _messageRepository: IMessageRepository,

    @inject("IChatRoomRepository")
    private _chatroomRepository: IChatRoomRepository,

    @inject("IRealTimeNotificationService")
    private _realTimeNotificationService: IRealTimeNotificationService
  ) {}

  async execute(data: {
    chatRoomId?: string;
    senderId: string;
    senderType: CHAT_USERS;
    receiverId: string;
    receiverType: CHAT_USERS;
    message: string;
    mediaAttachments?: MediaAttachment[];
    contextType: CHAT_CONTEXT_TYPE;
    contextId: string;
  }): Promise<IMessageEntity> {
    if (!data.senderId || !data.receiverId) {
      throw new CustomError(
        HTTP_STATUS.BAD_REQUEST,
        ERROR_MESSAGE.GROUP.MISSING_MESSAGE_DATA
      );
    }

    const hasText = data.message && data.message.trim().length > 0;
    const hasMedia = data.mediaAttachments && data.mediaAttachments.length > 0;

    if (!hasText && !hasMedia) {
      throw new CustomError(
        HTTP_STATUS.BAD_REQUEST,
        "Message must contain text or media"
      );
    }

    let messageType: "text" | "media" | "mixed" = "text";
    if (hasText && hasMedia) {
      messageType = "mixed";
    } else if (hasMedia) {
      messageType = "media";
      if (!data.message || data.message.trim().length === 0) {
        data.message =
          data.mediaAttachments!.length === 1
            ? `Sent ${data.mediaAttachments![0].type}`
            : `Sent ${data.mediaAttachments!.length} files`;
      }
    }

    let chatRoom;

    if (data.chatRoomId) {
      chatRoom = await this._chatroomRepository.findById(data.chatRoomId);
      if (!chatRoom) {
        throw new CustomError(
          HTTP_STATUS.NOT_FOUND,
          ERROR_MESSAGE.CHATROOM_NOT_FOUND
        );
      }
    } else {
      const participants = [
        { userId: data.senderId, userType: data.senderType },
        { userId: data.receiverId, userType: data.receiverType },
      ];

      chatRoom = await this._chatroomRepository.findByParticipants(
        participants,
        data.contextType,
        data.contextId
      );

      if (!chatRoom) {
        chatRoom = await this._chatroomRepository.save({
          participants,
          contextType: data.contextType,
          contextId: data.contextId,
        });
      }
    }
    const newMessage = await this._messageRepository.save({
      chatRoomId: chatRoom._id.toString(),
      senderId: data.senderId,
      senderType: data.senderType,
      receiverId: data.receiverId,
      recieverType: data.receiverType,
      message: data.message || "",
      mediaAttachments: data.mediaAttachments,
      messageType,
      status: "sent",
      contextType: data.contextType,
      contextId: data.contextId,
    });

    let lastMessagePreview = data.message || "";
    if (hasMedia && !hasText) {
      const mediaCount = data.mediaAttachments!.length;
      lastMessagePreview =
        mediaCount === 1
          ? `📎 ${
              data.mediaAttachments![0].type === "image"
                ? "Photo"
                : data.mediaAttachments![0].type === "video"
                ? "Video"
                : data.mediaAttachments![0].type === "voice"
                ? "Voice message"
                : "File"
            }`
          : `📎 ${mediaCount} files`;
    } else if (hasMedia && hasText) {
      lastMessagePreview = data.message;
    }

    await this._chatroomRepository.updateById(chatRoom._id.toString(), {
      lastMessage: lastMessagePreview,
      lastMessageAt: new Date(),
    });

    await this._realTimeNotificationService.sendMessageNotification(
      data.receiverId,
      {
        senderName: `User`,
        chatRoomId: chatRoom._id.toString(),
        messagePreview:
          lastMessagePreview.length > 50
            ? lastMessagePreview.substring(0, 50) + "..."
            : lastMessagePreview,
        senderId: data.senderId,
      }
    );

    return newMessage;
  }
}
