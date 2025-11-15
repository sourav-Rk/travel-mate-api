import { inject, injectable } from "tsyringe";

import { IGroupMessageEntity } from "../../../../domain/entities/group-message.entity";
import { CustomError } from "../../../../domain/errors/customError";
import { IGroupChatRepository } from "../../../../domain/repositoryInterfaces/group-chat/group-chat-repository.interface";
import { IGroupMessageRepository } from "../../../../domain/repositoryInterfaces/group-chat/group-message-repository.interface";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../../../shared/constants";
import { IGetGroupMessagesUsecase } from "../../interfaces/group-chat/get-group-messages-usecase.interface";

@injectable()
export class GetGroupMessagesUsecase implements IGetGroupMessagesUsecase {
  constructor(
    @inject("IGroupMessageRepository")
    private _groupMessageRepository: IGroupMessageRepository,

    @inject("IGroupChatRepository")
    private _groupChatRepository: IGroupChatRepository
  ) {}

  async execute(groupChatId: string): Promise<IGroupMessageEntity[]> {
    const groupChat = await this._groupChatRepository.findById(groupChatId);
    if (!groupChat) {
      throw new CustomError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_MESSAGE.GROUP.NO_GROUP_CHAT
      );
    }

    const messages = await this._groupMessageRepository.findByGroup(
      groupChatId
    );

    return messages.reverse();
  }
}


















