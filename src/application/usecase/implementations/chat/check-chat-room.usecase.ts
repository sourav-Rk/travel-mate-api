import { inject, injectable } from "tsyringe";
import { ICheckChatRoomUsecase } from "../../interfaces/chat/check-chat-room-usecase.interface";
import { IChatRoomRepository } from "../../../../domain/repositoryInterfaces/chatroom/chatroom-repository.interface";
import { IChatRoomEntity } from "../../../../domain/entities/chatroom.entity";
import { Participants } from "../../../dto/response/chatroomDto";
import {
  acquireChatroomLock,
  releaseChatroomLock,
} from "../../../../infrastructure/config/socket/chatroomMutex";
import { CHAT_CONTEXT_TYPE } from "../../../../shared/constants";

@injectable()
export class CheckChatRoomUsecase implements ICheckChatRoomUsecase {
  constructor(
    @inject("IChatRoomRepository")
    private _chatRoomRepository: IChatRoomRepository
  ) {}

  async execute(
    participants: Participants[],
    contextType: CHAT_CONTEXT_TYPE,
    contextId: string
  ): Promise<IChatRoomEntity | null> {

    let chatroom = await this._chatRoomRepository.findByParticipants(
      participants,
      contextType,
      contextId
    );

    if (chatroom) {
      return chatroom;
    }

    const lockAcquired = acquireChatroomLock(
      participants,
      contextType,
      contextId
    );

    if (!lockAcquired) {
      await new Promise((resolve) => setTimeout(resolve, 100));

      chatroom = await this._chatRoomRepository.findByParticipants(
        participants,
        contextType,
        contextId
      );

      if (chatroom) {
        return chatroom;
      }

      await new Promise((resolve) => setTimeout(resolve, 200));
      chatroom = await this._chatRoomRepository.findByParticipants(
        participants,
        contextType,
        contextId
      );

      if (chatroom) {
        return chatroom;
      }
    }

    try {
      chatroom = await this._chatRoomRepository.findByParticipants(
        participants,
        contextType,
        contextId
      );

      if (chatroom) {
        return chatroom;
      }

      chatroom = await this._chatRoomRepository.save({
        participants,
        contextType,
        contextId,
      });

      return chatroom;
    } finally {
      releaseChatroomLock(participants, contextType, contextId);
    }
  }
}
