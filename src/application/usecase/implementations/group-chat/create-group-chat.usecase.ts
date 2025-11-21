import { inject, injectable } from "tsyringe";

import { IGroupChatEntity } from "../../../../domain/entities/group-chat.entity";
import { CustomError } from "../../../../domain/errors/customError";
import { IGroupChatRepository } from "../../../../domain/repositoryInterfaces/group-chat/group-chat-repository.interface";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../../../shared/constants";
import { CreateGroupChatDTO } from "../../../dto/response/groupChatDto";
import { ICreateGroupChatUsecase } from "../../interfaces/group-chat/create-group-chat-usecase.interface";

@injectable()
export class CreateGroupChatUsecase implements ICreateGroupChatUsecase {
  constructor(
    @inject("IGroupChatRepository")
    private _groupChatRepository: IGroupChatRepository
  ) {}

  async execute(data: CreateGroupChatDTO): Promise<IGroupChatEntity> {

    const existingGroupChat = await this._groupChatRepository.findByPackage(
      data.packageId
    );

    if (existingGroupChat) {
      return existingGroupChat;
    }

    if (!data.members || data.members.length < 2) {
      throw new CustomError(
        HTTP_STATUS.BAD_REQUEST,
        ERROR_MESSAGE.GROUP.ATLEAST_TWO_MEMBERS
      );
    }

    const groupChat = await this._groupChatRepository.save({
      packageId: data.packageId,
      name: data.name,
      members: data.members,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return groupChat;
  }
}





























