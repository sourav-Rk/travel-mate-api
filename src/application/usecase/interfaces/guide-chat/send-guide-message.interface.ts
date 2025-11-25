import { GuideSendMessageDto } from "../../../dto/request/guide-chat.dto";
import { GuideMessageDto } from "../../../dto/response/guide-chat.dto";

export interface ISendGuideMessageUsecase {
  execute(data: GuideSendMessageDto): Promise<GuideMessageDto>;
}















