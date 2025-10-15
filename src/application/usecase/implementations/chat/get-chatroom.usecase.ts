import { inject, injectable } from "tsyringe";
import { IGetChatroomUsecase } from "../../interfaces/chat/get-chatroom-usecase.interface";
import { IChatRoomRepository } from "../../../../domain/repositoryInterfaces/chatroom/chatroom-repository.interface";
import { IChatRoomEntity } from "../../../../domain/entities/chatroom.entity";
import { ValidationError } from "../../../../domain/errors/validationError";
import { ERROR_MESSAGE } from "../../../../shared/constants";
import { NotFoundError } from "../../../../domain/errors/notFoundError";

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
