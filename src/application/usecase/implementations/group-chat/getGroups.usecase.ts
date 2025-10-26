import { inject, injectable } from "tsyringe";
import { IGetGroupsUsecase } from "../../interfaces/group-chat/get-groups-usecase.interface";
import { IGroupChatRepository } from "../../../../domain/repositoryInterfaces/group-chat/group-chat-repository.interface";
import { IGroupChatEntity } from "../../../../domain/entities/group-chat.entity";

@injectable()
export class GetGroupsUsecase implements IGetGroupsUsecase {
  constructor(
    @inject("IGroupChatRepository")
    private _groupChatRepository: IGroupChatRepository
  ) {}

  async execute(userId: string,searchTerm?:string): Promise<IGroupChatEntity[]> {
    const groups = await this._groupChatRepository.findByUserId(userId,searchTerm);
    return groups;
  }
}
