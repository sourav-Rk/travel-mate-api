import { inject, injectable } from "tsyringe";

import { CustomError } from "../../../../domain/errors/customError";
import { IMessageRepository } from "../../../../domain/repositoryInterfaces/message/message-repository.interface";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../../../shared/constants";
import { IMarkAsDeliveredUsecase } from "../../interfaces/chat/mark-delivered-usecase.interface";

@injectable()
export class MarkAsDeliveredUsecase implements IMarkAsDeliveredUsecase {
  constructor(
    @inject("IMessageRepository")
    private _messageRepository: IMessageRepository
  ) {}

  async execute(chatRoomId: string, userId: string): Promise<{messageIds : string[]}> {
    if (!chatRoomId || !userId) {
      throw new CustomError(HTTP_STATUS.BAD_REQUEST, ERROR_MESSAGE.ID_REQUIRED);
    }

   return await this._messageRepository.markAsDelivered(chatRoomId, userId);
  }
}
