import { LocalGuideProfileDto } from "../../../../application/dto/response/local-guide.dto";

export interface IVerifyLocalGuideUsecase {
  execute(profileId: string): Promise<LocalGuideProfileDto>;
}

