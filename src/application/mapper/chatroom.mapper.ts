import { instanceToPlain, plainToInstance } from "class-transformer";
import { IChatRoomEntity } from "../../domain/entities/chatroom.entity";
import { IChatroomModel } from "../../infrastructure/database/models/chatroom.model";
import { ChatRoomDTO } from "../dto/response/chatroomDto";

export class ChatRoomMapper {
  static toEntity(doc: IChatroomModel): IChatRoomEntity {
    return {
      _id: String(doc._id),
      contextType: doc.contextType,
      contextId: doc.contextId,
      lastMessage: doc.lastMessage,
      lastMessageAt: doc.lastMessageAt,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      participants: doc.participants
        ? doc.participants.map((d) => ({
            userId: d.userId.toString(),
            userType: d.userType,
          }))
        : [],
    };
  }
}
