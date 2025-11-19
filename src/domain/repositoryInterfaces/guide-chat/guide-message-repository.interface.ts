import { IGuideMessageEntity } from "../../../domain/entities/guide-message.entity";
import { IBaseRepository } from "../baseRepository.interface";

export interface IGuideMessageRepository extends IBaseRepository<IGuideMessageEntity> {
  create(
    message: Omit<IGuideMessageEntity, "_id" | "createdAt" | "updatedAt">
  ): Promise<IGuideMessageEntity>;
  listByRoom(
    guideChatRoomId: string,
    limit: number,
    before?: Date
  ): Promise<IGuideMessageEntity[]>;
  markDelivered(
    guideChatRoomId: string,
    userId: string
  ): Promise<string[]>;
  markRead(guideChatRoomId: string, userId: string): Promise<string[]>;
  findQuotesByUserId(
    userId: string,
    status?: "pending" | "accepted" | "declined"
  ): Promise<IGuideMessageEntity[]>;
  findByQuoteId(quoteId: string): Promise<IGuideMessageEntity | null>;
  updateQuoteStatus(
    quoteId: string,
    status: "pending" | "accepted" | "declined"
  ): Promise<void>;
}


