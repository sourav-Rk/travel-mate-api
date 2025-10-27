import { GuideProfileDto } from "../../../dto/response/guideDto";

export interface IGetGuideProfileUsecase {
  execute(id: string): Promise<GuideProfileDto>;
}
