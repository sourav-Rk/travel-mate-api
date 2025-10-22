import { injectable } from "tsyringe";
import { BaseRepository } from "../baseRepository";
import {
  groupMessageDB,
  IGroupMessageModel,
} from "../../database/models/group-message.model";
import { IGroupMessageEntity } from "../../../domain/entities/group-message.entity";
import { IGroupMessageRepository } from "../../../domain/repositoryInterfaces/group-chat/group-message-repository.interface";

@injectable()
export class GroupMessageRepository
  extends BaseRepository<IGroupMessageModel, IGroupMessageEntity>
  implements IGroupMessageRepository
{
  constructor() {
    super(groupMessageDB);
  }

  async findByGroup(groupChatId: string): Promise<IGroupMessageEntity[]> {
    return await groupMessageDB.find({ groupChatId });
  }
}
