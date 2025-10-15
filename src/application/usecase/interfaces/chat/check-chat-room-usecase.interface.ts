import { IChatRoomEntity } from "../../../../domain/entities/chatroom.entity";
import {
  ChatRoomFindDto,
  Participants,
} from "../../../dto/response/chatroomDto";

export interface ICheckChatRoomUsecase {
  execute(
    participants: Participants[],
    contextType: "vendor_client" | "guide_client" | "client_client",
    contextId : string
  ): Promise<IChatRoomEntity | null>;
}
