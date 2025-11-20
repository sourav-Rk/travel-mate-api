import { GuideMessageDto } from "../../../dto/response/guide-chat.dto";

export interface IGetGuideMessagesUsecase {
  execute(
    guideChatRoomId: string,
    limit: number,
    before?: Date
  ): Promise<GuideMessageDto[]>;
}








