import { IGuideChatRoomEntity } from "../../domain/entities/guide-chat-room.entity";
import { IGuideMessageEntity } from "../../domain/entities/guide-message.entity";
import { IGuideChatRoomModel } from "../../infrastructure/database/models/guide-chat-room.model";
import { IGuideMessageModel } from "../../infrastructure/database/models/guide-message.model";
import {
  GuideChatRoomDto,
  GuideMessageDto,
} from "../dto/response/guide-chat.dto";

type EnrichedParticipant = {
  userId: string;
  role: "client" | "guide";
  firstName?: string;
  lastName?: string;
  profileImage?: string;
};

export class LocalGuideMessageMapper {
  static toLocalGuideChatRoomEntity(
    doc: IGuideChatRoomModel
  ): IGuideChatRoomEntity {
    return {
      _id: String(doc._id),
      roomKey: doc.roomKey,
      participants: doc.participants.map((participant) => ({
        userId: String(participant.userId),
        role: participant.role,
      })),
      latestContext: doc.latestContext,
      lastMessage: doc.lastMessage,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  static toEntity(doc: IGuideMessageModel): IGuideMessageEntity {
    return {
      _id: doc._id.toString(),
      guideChatRoomId: doc.guideChatRoomId.toString(),
      senderId: doc.senderId.toString(),
      senderRole: doc.senderRole,
      messageType: doc.messageType,
      message: doc.message,
      mediaAttachments: doc.mediaAttachments,
      deliveredTo: doc.deliveredTo?.map((id) => id.toString()),
      readBy: doc.readBy?.map((id) => id.toString()),
      metadata: doc.metadata ?? undefined,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
  static maptToGuideChatRoomDto(
    doc: IGuideChatRoomEntity,
    participants: EnrichedParticipant[]
  ): GuideChatRoomDto {
    return {
      _id: String(doc._id),
      roomKey: doc.roomKey,
      latestContext: doc.latestContext,
      lastMessage: doc.lastMessage,
      lastMessageAt: doc.lastMessageAt,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      participants,
    };
  }

  static mapToGuideMessageDto(message: IGuideMessageEntity): GuideMessageDto {
    return {
      _id: message._id!,
      guideChatRoomId: message.guideChatRoomId,
      senderId: message.senderId,
      senderRole: message.senderRole,
      messageType: message.messageType,
      message: message.message,
      mediaAttachments: message.mediaAttachments,
      deliveredTo: message.deliveredTo,
      readBy: message.readBy,
      metadata: message.metadata!,
      createdAt: message.createdAt!,
      updatedAt: message.updatedAt!,
    };
  }
}
