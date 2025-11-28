import { GuideReviewAggregateResult } from "../../../dto/response/reviewDto";

export interface IGetMyGuideReviewsUsecase {
  execute(guideId: string): Promise<GuideReviewAggregateResult>;
}

