import { inject, injectable } from "tsyringe";
import { IGetMessagesUsecase } from "../../interfaces/chat/get-message-usecase.interface";
import { IMessageRepository } from "../../../../domain/repositoryInterfaces/message/message-repository.interface";
import { PaginatedMessagesDto } from "../../../dto/response/messageDto";
import { ERROR_MESSAGE } from "../../../../shared/constants";
import { ValidationError } from "../../../../domain/errors/validationError";
import { IMessageEntity } from "../../../../domain/entities/message.entity";

@injectable()
export class GetMessagesUsecase implements IGetMessagesUsecase {
  constructor(
    @inject("IMessageRepository")
    private _messageRepository: IMessageRepository
  ) {}

  async execute(
    chatroomId: string,
    limit: number,
    userId: string,
    before?: string
  ): Promise<IMessageEntity[]> {
    if (!userId || !chatroomId) {
      throw new ValidationError(ERROR_MESSAGE.ID_REQUIRED);
    }

    const messages = await this._messageRepository.getMessagesByChatRoom(
      chatroomId,
      limit,
      before
    );

    return messages;
  }
}
