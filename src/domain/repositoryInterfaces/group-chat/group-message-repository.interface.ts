import { IGroupMessageEntity } from "../../entities/group-message.entity";
import { IBaseRepository } from "../baseRepository.interface";

export interface IGroupMessageRepository
  extends IBaseRepository<IGroupMessageEntity> {
  findByGroup(groupChatId: string): Promise<IGroupMessageEntity[]>;
  markAsRead(groupChatId: string, userId: string): Promise<{ messageIds: string[] }>;
  markAsDelivered(groupChatId: string, userId: string): Promise<{ messageIds: string[] }>;
}
