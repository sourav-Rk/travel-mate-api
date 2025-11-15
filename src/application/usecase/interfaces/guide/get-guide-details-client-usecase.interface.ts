import { GuideDetailsForClientDto } from "../../../dto/response/guideDto";

export interface IGetGuideDetailsClientUsecase {
  execute(
    userId: string,
    guideId: string
  ): Promise<GuideDetailsForClientDto | null>;
}
