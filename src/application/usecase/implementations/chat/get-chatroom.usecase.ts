import { inject, injectable } from "tsyringe";

import { IChatRoomEntity } from "../../../../domain/entities/chatroom.entity";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ValidationError } from "../../../../domain/errors/validationError";
import { IChatRoomRepository } from "../../../../domain/repositoryInterfaces/chatroom/chatroom-repository.interface";
import { ERROR_MESSAGE } from "../../../../shared/constants";
import { IGetChatroomUsecase } from "../../interfaces/chat/get-chatroom-usecase.interface";

@injectable()
export class GetChatroomUsecase implements IGetChatroomUsecase {
  constructor(
    @inject("IChatRoomRepository")
    private _chatroomRepository: IChatRoomRepository
  ) {}

  async execute(id: string): Promise<IChatRoomEntity | null> {
    if (!id) {
      throw new ValidationError(ERROR_MESSAGE.ID_REQUIRED);
    }

    const chatroom = await this._chatroomRepository.findById(id);

    if (!chatroom) {
      throw new NotFoundError(ERROR_MESSAGE.CHATROOM_NOT_FOUND);
    }

    return chatroom;
  }
}
