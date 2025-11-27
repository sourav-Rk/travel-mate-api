import { GuideChatRoomDto } from "../../../dto/response/guide-chat.dto";

export interface IGetGuideChatRoomsUsecase {
  execute(userId: string): Promise<GuideChatRoomDto[]>;
}
















