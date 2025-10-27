import { IGroupChatEntity } from "../../domain/entities/group-chat.entity";
import { IGroupChatModel } from "../../infrastructure/database/models/group-chat.model";
import {
  GroupChatDetailsDto,
  GroupChatDetailsQueryDto,
} from "../dto/response/groupChatDto";

export class GroupChatMapper {
  static toEntity(doc: IGroupChatModel): IGroupChatEntity {
    return {
      _id: String(doc._id),
      name: doc.name,
      packageId: doc.packageId,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      members: doc.members,
      lastMessage: doc.lastMessage,
      lastMessageAt: doc.lastMessageAt,
    };
  }

  static mapToGroupChatDetails(
    doc: GroupChatDetailsQueryDto
  ): GroupChatDetailsDto {
    return {
      _id: String(doc._id),
      name: doc.name,
      packageId: doc.packageId,
      createdAt: doc.createdAt,
      membersCount: doc.membersCount,
      memberDetails: doc.memberDetails,
    };
  }
}
