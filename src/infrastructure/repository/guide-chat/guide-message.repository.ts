import { Types } from "mongoose";
import { injectable } from "tsyringe";

import { IGuideMessageEntity } from "../../../domain/entities/guide-message.entity";
import { IGuideMessageRepository } from "../../../domain/repositoryInterfaces/guide-chat/guide-message-repository.interface";
import {
  guideMessageDB,
  IGuideMessageModel,
} from "../../database/models/guide-message.model";
import {
  guideChatRoomDB,
} from "../../database/models/guide-chat-room.model";
import { BaseRepository } from "../baseRepository";
import { LocalGuideMessageMapper } from "../../../application/mapper/local-guide-chat.mapper";

@injectable()
export class GuideMessageRepository
  extends BaseRepository<IGuideMessageModel, IGuideMessageEntity>
  implements IGuideMessageRepository
{
  constructor() {
    super(guideMessageDB, LocalGuideMessageMapper.toEntity);
  }
  async create(
    message: Omit<IGuideMessageEntity, "_id" | "createdAt" | "updatedAt">
  ): Promise<IGuideMessageEntity> {
    const created = await guideMessageDB.create(message);
    return LocalGuideMessageMapper.toEntity(created);
  }

  async listByRoom(
    guideChatRoomId: string,
    limit: number,
    before?: Date
  ): Promise<IGuideMessageEntity[]> {
    const filter: Record<string, unknown> = { guideChatRoomId };
    if (before) {
      filter.createdAt = { $lt: before };
    }

    const messages = await guideMessageDB
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return messages.reverse().map(LocalGuideMessageMapper.toEntity);
  }

  async markDelivered(
    guideChatRoomId: string,
    userId: string
  ): Promise<string[]> {
    const userObjectId = new Types.ObjectId(userId);
    const pendingMessages = await guideMessageDB
      .find({
        guideChatRoomId,
        deliveredTo: { $ne: userObjectId },
        senderId: { $ne: userId },
      })
      .lean();

    if (pendingMessages.length === 0) {
      return [];
    }

    await guideMessageDB.updateMany(
      {
        _id: { $in: pendingMessages.map((message) => message._id) },
      },
      { $addToSet: { deliveredTo: userObjectId } }
    );

    return pendingMessages.map((message) => message._id.toString());
  }

  async markRead(guideChatRoomId: string, userId: string): Promise<string[]> {
    const userObjectId = new Types.ObjectId(userId);
    const unreadMessages = await guideMessageDB
      .find({
        guideChatRoomId,
        readBy: { $ne: userObjectId },
        senderId: { $ne: userId },
      })
      .lean();

    if (unreadMessages.length === 0) {
      return [];
    }

    await guideMessageDB.updateMany(
      { _id: { $in: unreadMessages.map((message) => message._id) } },
      { $addToSet: { readBy: userObjectId } }
    );

    return unreadMessages.map((message) => message._id.toString());
  }

  async findQuotesByUserId(
    userId: string,
    status?: "pending" | "accepted" | "declined"
  ): Promise<IGuideMessageEntity[]> {
    /**
     * Get all chat rooms where user is participant 
     */
    const userObjectId = new Types.ObjectId(userId);
    const rooms = await guideChatRoomDB
      .find({ "participants.userId": userObjectId })
      .select("_id")
      .lean();

    const roomIds = rooms.map((room) => room._id);

    if (roomIds.length === 0) {
      return [];
    }

    /**
     * Build query for quote messages 
     */
    const query: Record<string, unknown> = {
      guideChatRoomId: { $in: roomIds },
      messageType: "quote",
    };

  
    /**
     * Filter by metadata.status if provided 
     */
    if (status) {
      query["metadata.status"] = status;
    } else {
      /**
       * Default: only pending quotes (not expired) 
       */
      query["metadata.status"] = "pending";
      /**
       * Also check expiration - exclude expired quotes 
       */
      const now = new Date();
      query["metadata.expiresAt"] = { $gt: now.toISOString() };
    }

    /**
     * Query messages 
     */
    const messages = await guideMessageDB
      .find(query)
      .sort({ createdAt: -1 })
      .lean();

    return messages.map(LocalGuideMessageMapper.toEntity);
  }

  async findByQuoteId(quoteId: string): Promise<IGuideMessageEntity | null> {
    const message = await guideMessageDB
      .findOne({
        messageType: "quote",
        "metadata.quoteId": quoteId,
      })
      .lean();
    return message ? LocalGuideMessageMapper.toEntity(message) : null;
  }

  async updateQuoteStatus(
    quoteId: string,
    status: "pending" | "accepted" | "declined"
  ): Promise<void> {
    await guideMessageDB.updateOne(
      {
        messageType: "quote",
        "metadata.quoteId": quoteId,
      },
      {
        $set: {
          "metadata.status": status,
        },
      }
    );
  }
}
