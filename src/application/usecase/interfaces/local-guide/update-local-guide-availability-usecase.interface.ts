import { LocalGuideProfileDto } from "../../../dto/response/local-guide.dto";

export interface IUpdateLocalGuideAvailabilityUsecase {
  execute(
    userId: string,
    isAvailable: boolean,
    availabilityNote?: string
  ): Promise<LocalGuideProfileDto>;
}

