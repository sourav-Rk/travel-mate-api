import { inject, injectable } from "tsyringe";
import { IMarkReadUsecase } from "../../interfaces/chat/mark-read-usecase.interface";
import { IMessageRepository } from "../../../../domain/repositoryInterfaces/message/message-repository.interface";
import { CustomError } from "../../../../domain/errors/customError";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../../../shared/constants";

@injectable()
export class MarkReadUsecase implements IMarkReadUsecase {
  constructor(
    @inject("IMessageRepository")
    private _messageRepository: IMessageRepository
  ) {}

  async execute(chatRoomId: string, userId: string): Promise<{messageIds : string[]}> {
    if (!chatRoomId || !userId) {
      throw new CustomError(HTTP_STATUS.BAD_REQUEST, ERROR_MESSAGE.ID_REQUIRED);
    }
   return await this._messageRepository.markAsRead(chatRoomId, userId);

  }
}
