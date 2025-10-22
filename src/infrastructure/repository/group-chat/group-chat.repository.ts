import { injectable } from "tsyringe";
import { BaseRepository } from "../baseRepository";
import {
  groupChatDB,
  IGroupChatModel,
} from "../../database/models/group-chat.model";
import { IGroupChatEntity } from "../../../domain/entities/group-chat.entity";
import { IGroupChatRepository } from "../../../domain/repositoryInterfaces/group-chat/group-chat-repository.interface";

@injectable()
export class GroupChatRepository
  extends BaseRepository<IGroupChatModel, IGroupChatEntity>
  implements IGroupChatRepository
{
  constructor() {
    super(groupChatDB);
  }

  async findByPackage(packageId: string): Promise<IGroupChatEntity | null> {
    return await groupChatDB.findOne({ packageId });    
  }
}
