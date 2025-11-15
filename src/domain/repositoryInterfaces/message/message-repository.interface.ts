import { IMessageEntity } from "../../entities/message.entity";
import { IBaseRepository } from "../baseRepository.interface";

export interface IMessageRepository extends IBaseRepository<IMessageEntity> {
  getMessagesByChatRoom(
    chatRoomId: string,
    limit: number,
    before?: string
  ): Promise<IMessageEntity[]>;
  markAsRead(
    chatRoomId: string,
    userId: string
  ): Promise<{ messageIds: string[] }>;
  updateMessageStatus(
    messageId: string,
    status: "sent" | "delivered" | "read"
  ): Promise<IMessageEntity | null>;
  markAsDelivered(
    chatRoomId: string,
    userId: string
  ): Promise<{ messageIds: string[] }>;
  getUnreadCount(chatRoomId: string, userId: string): Promise<number>;
}
