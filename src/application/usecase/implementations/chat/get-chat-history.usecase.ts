import { inject, injectable } from "tsyringe";
import { IGetChatHistoryUsecase } from "../../interfaces/chat/get-chat-history-usecase.interface";
import { IChatRoomRepository } from "../../../../domain/repositoryInterfaces/chatroom/chatroom-repository.interface";
import { ChatListItemDTO } from "../../../dto/response/chatroomDto";

@injectable()
export class GetChatHistoryUsecase implements IGetChatHistoryUsecase {
  constructor(
    @inject("IChatRoomRepository")
    private _chatRoomRepository: IChatRoomRepository
  ) {}

  async execute(
    userId: string,
    page = 1,
    limit = 20,
    searchTerm: string
  ): Promise<ChatListItemDTO[]> {
    const chatRooms = await this._chatRoomRepository.getChatRoomsByUser(
      userId,
      page,
      limit,
      searchTerm
    );

    const data =  chatRooms.chats.map((r) => ({
      roomId: r.roomId,
      peer: r.peer,
      peerInfo: r.peerInfo,
      contextType : r.contextType,
      contextId : r.contextId,
      lastMessage: r.lastMessage,
      lastMessageAt: r.lastMessageAt,
      lastMessageReadAt: r.lastMessageReadAt,
      lastMessageStatus: r.lastMessageStatus,
    }));

    return data
  }
}
