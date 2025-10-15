import { ChatListResponseDTO } from "../../../application/dto/response/chatroomDto";
import { IChatRoomEntity } from "../../entities/chatroom.entity";
import { IBaseRepository } from "../baseRepository.interface";

export interface IChatRoomRepository extends IBaseRepository<IChatRoomEntity> {
  findByParticipants(
    participants: { userId: string; userType: "client" | "guide" | "vendor" }[],
    contextType: "vendor_client" | "guide_client" | "client_client",
    contextId: string
  ): Promise<IChatRoomEntity | null>;
  getChatRoomsByUser(
    userId: string,
    page: number,
    limit: number,
    searchTerm?: string
  ): Promise<ChatListResponseDTO>;
}
