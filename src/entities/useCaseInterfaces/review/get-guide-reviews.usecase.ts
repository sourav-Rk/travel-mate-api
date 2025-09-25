import { ReviewListDto } from "../../../shared/dto/reviewDto";

export interface IGetGuideReviewUsecase {
  execute(packageId: string, guideId: string): Promise<ReviewListDto[] | []>;
}
