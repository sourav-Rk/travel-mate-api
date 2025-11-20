import { GuideChatCreateDto } from "../../../dto/request/guide-chat.dto";
import { GuideChatRoomDto } from "../../../dto/response/guide-chat.dto";

export interface ICreateGuideChatRoomUsecase {
  execute(data: GuideChatCreateDto): Promise<GuideChatRoomDto>;
}








