import { inject, injectable } from "tsyringe";
import { IGetGroupMessagesUsecase } from "../../interfaces/group-chat/get-group-messages-usecase.interface";
import { IGroupMessageRepository } from "../../../../domain/repositoryInterfaces/group-chat/group-message-repository.interface";
import { IGroupChatRepository } from "../../../../domain/repositoryInterfaces/group-chat/group-chat-repository.interface";
import { IGroupMessageEntity } from "../../../../domain/entities/group-message.entity";
import { CustomError } from "../../../../domain/errors/customError";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../../../shared/constants";

@injectable()
export class GetGroupMessagesUsecase implements IGetGroupMessagesUsecase {
  constructor(
    @inject("IGroupMessageRepository")
    private _groupMessageRepository: IGroupMessageRepository,

    @inject("IGroupChatRepository")
    private _groupChatRepository: IGroupChatRepository
  ) {}

  async execute(
    groupChatId: string,
    limit: number,
    before?: string
  ): Promise<IGroupMessageEntity[]> {
    const groupChat = await this._groupChatRepository.findById(groupChatId);
    if (!groupChat) {
      throw new CustomError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_MESSAGE.GROUP.NO_GROUP_CHAT
      );
    }

    if (limit <= 0 || limit > 100) {
      throw new CustomError(HTTP_STATUS.BAD_REQUEST,ERROR_MESSAGE.LIMIT);
    }

    // Get messages from the repository
    const messages = await this._groupMessageRepository.findByGroup(
      groupChatId
    );

    // Sort by creation date (newest first)
    const sortedMessages = messages.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Apply pagination if 'before' is provided
    let filteredMessages = sortedMessages;
    if (before) {
      const beforeDate = new Date(before);
      if (!isNaN(beforeDate.getTime())) {
        filteredMessages = sortedMessages.filter(
          (msg) => new Date(msg.createdAt) < beforeDate
        );
      }
    }

    // Apply limit
    const limitedMessages = filteredMessages.slice(0, limit);

    // Return in chronological order (oldest first)
    const result = limitedMessages.reverse();

    console.log(`Retrieved ${result.length} group messages`);
    return result;
  }
}
