import { IChatRoomEntity } from "../../../../domain/entities/chatroom.entity";
import { CHAT_CONTEXT_TYPE } from "../../../../shared/constants";
import {
  ChatRoomFindDto,
  Participants,
} from "../../../dto/response/chatroomDto";

export interface ICheckChatRoomUsecase {
  execute(
    participants: Participants[],
    contextType: CHAT_CONTEXT_TYPE,
    contextId : string
  ): Promise<IChatRoomEntity | null>;
}
