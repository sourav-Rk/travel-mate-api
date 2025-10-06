import { ReviewListDto } from "../../../dto/response/reviewDto";

export interface IGetGuideReviewUsecase {
  execute(packageId: string, guideId: string): Promise<ReviewListDto[] | []>;
}
