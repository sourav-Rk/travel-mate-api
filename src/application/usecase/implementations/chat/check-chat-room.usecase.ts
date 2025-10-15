import { inject, injectable } from "tsyringe";
import { ICheckChatRoomUsecase } from "../../interfaces/chat/check-chat-room-usecase.interface";
import { IChatRoomRepository } from "../../../../domain/repositoryInterfaces/chatroom/chatroom-repository.interface";
import { IChatRoomEntity } from "../../../../domain/entities/chatroom.entity";
import { Participants } from "../../../dto/response/chatroomDto";

@injectable()
export class CheckChatRoomUsecase implements ICheckChatRoomUsecase {
  constructor(
    @inject("IChatRoomRepository")
    private _chatRoomRepository: IChatRoomRepository
  ) {}

  async execute(
    participants: Participants[],
    contextType: "vendor_client" | "guide_client" | "client_client",
    contextId: string
  ): Promise<IChatRoomEntity | null> {


    console.log(participants,contextType,contextId,"-->usecase data")

    let chatroom = await this._chatRoomRepository.findByParticipants(
      participants,
      contextType,
      contextId
    );

    console.log(chatroom,"-->chatrrrom")

    if (!chatroom) {
      chatroom = await this._chatRoomRepository.save({
        participants,
        contextType,
        contextId
      });
    }

    return chatroom;
  }
}
