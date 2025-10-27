import { FilterQuery } from "mongoose";
import { injectable } from "tsyringe";

import { MessageMapper } from "../../../application/mapper/message.mapper";
import { IMessageEntity } from "../../../domain/entities/message.entity";
import { IMessageRepository } from "../../../domain/repositoryInterfaces/message/message-repository.interface";
import { IMessageModel, messageDB } from "../../database/models/message.model";
import { BaseRepository } from "../baseRepository";

@injectable()
export class MessageRepository
  extends BaseRepository<IMessageModel, IMessageEntity>
  implements IMessageRepository
{
  constructor() {
    super(messageDB, MessageMapper.toEntity);
  }

  async getMessagesByChatRoom(
    chatRoomId: string,
    limit: number,
    before?: string
  ): Promise<IMessageEntity[]> {
    const query: FilterQuery<IMessageModel> = { chatRoomId };

    if (before && !isNaN(new Date(before).getTime())) {
      query.createdAt = { $lt: new Date(before) };
    }

    const data = await messageDB
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit);

    const messages = data.map((msg) => MessageMapper.toEntity(msg)).reverse();

    return messages;
  }

  async markAsRead(
    chatRoomId: string,
    userId: string
  ): Promise<{ messageIds: string[] }> {
    const messagesToUpdate = await messageDB.find({
      chatRoomId,
      receiverId: userId,
      status: { $in: ["sent", "delivered"] },
    });

    if (messagesToUpdate.length === 0) {
      return { messageIds: [] };
    }

    const messageIds = messagesToUpdate.map((msg) => msg._id.toString());

    await messageDB.updateMany(
      {
        chatRoomId,
        receiverId: userId,
        status: { $in: ["sent", "delivered"] },
      },
      {
        $set: {
          status: "read",
          readAt: new Date(),
        },
        $addToSet: { deliveredTo: userId },
      }
    );

    return { messageIds };
  }

  async updateMessageStatus(
    messageId: string,
    status: "sent" | "delivered" | "read"
  ): Promise<IMessageEntity | null> {
    const updateData: FilterQuery<IMessageModel> = { status };

    if (status === "read") {
      updateData.readAt = new Date();
    }

    const updatedMessage = await messageDB.findByIdAndUpdate(
      messageId,
      updateData,
      { new: true }
    );

    return updatedMessage ? MessageMapper.toEntity(updatedMessage) : null;
  }

  async markAsDelivered(
    chatRoomId: string,
    userId: string
  ): Promise<{ messageIds: string[] }> {
    const messagesToUpdate = await messageDB.find({
      chatRoomId,
      receiverId: userId,
      status: "sent",
    });

    if (messagesToUpdate.length === 0) {
      return { messageIds: [] };
    }

    const messageIds = messagesToUpdate.map((msg) => msg._id.toString());

    await messageDB.updateMany(
      {
        chatRoomId,
        receiverId: userId,
        status: "sent",
      },
      {
        $set: { status: "delivered" },
        $addToSet: { deliveredTo: userId },
      }
    );
    return { messageIds };
  }

  async getUnreadCount(chatRoomId: string, userId: string): Promise<number> {
    return await messageDB.countDocuments({
      chatRoomId,
      receiverId: userId,
      status: { $in: ["sent", "delivered"] },
    });
  }
}
