import { ChatListResponseDTO } from "../../../application/dto/response/chatroomDto";
import { CHAT_CONTEXT_TYPE, CHAT_USERS } from "../../../shared/constants";
import { IChatRoomEntity } from "../../entities/chatroom.entity";
import { IBaseRepository } from "../baseRepository.interface";

export interface IChatRoomRepository extends IBaseRepository<IChatRoomEntity> {
  findByParticipants(
    participants: { userId: string; userType: CHAT_USERS }[],
    contextType: CHAT_CONTEXT_TYPE,
    contextId: string
  ): Promise<IChatRoomEntity | null>;
  getChatRoomsByUser(
    userId: string,
    page: number,
    limit: number,
    searchTerm?: string
  ): Promise<ChatListResponseDTO>;
}
