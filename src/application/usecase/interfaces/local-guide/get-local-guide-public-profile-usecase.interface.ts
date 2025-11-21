import { LocalGuideProfileDto, LocalGuidePublicProfileDto } from "../../../../application/dto/response/local-guide.dto";

export interface IGetLocalGuidePublicProfileUsecase {
  execute(profileId: string): Promise<LocalGuidePublicProfileDto>;
}



