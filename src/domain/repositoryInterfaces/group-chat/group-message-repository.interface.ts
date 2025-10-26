import { IGroupMessageEntity } from "../../entities/group-message.entity";
import { IBaseRepository } from "../baseRepository.interface";

export interface IGroupMessageRepository
  extends IBaseRepository<IGroupMessageEntity> {
  findByGroup(groupChatId: string): Promise<IGroupMessageEntity[]>;
}
