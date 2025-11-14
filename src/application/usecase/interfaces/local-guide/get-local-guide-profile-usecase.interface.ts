import { LocalGuideProfileDto } from "../../../dto/response/local-guide.dto";

export interface IGetLocalGuideProfileUsecase {
  execute(userId: string): Promise<LocalGuideProfileDto | null>;
}

