import { LocalGuideProfileDto } from "../../../../application/dto/response/local-guide.dto";

export interface IRejectLocalGuideUsecase {
  execute(profileId: string, rejectionReason: string): Promise<LocalGuideProfileDto>;
}

