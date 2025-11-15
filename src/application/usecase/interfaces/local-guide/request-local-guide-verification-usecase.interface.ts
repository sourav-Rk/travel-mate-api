import { RequestLocalGuideVerificationReqDTO } from "../../../../application/dto/request/local-guide.dto";
import { LocalGuideProfileDto } from "../../../../application/dto/response/local-guide.dto";

export interface IRequestLocalGuideVerificationUsecase {
  execute(
    userId: string,
    data: RequestLocalGuideVerificationReqDTO
  ): Promise<LocalGuideProfileDto>;
}

