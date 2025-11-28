import { inject, injectable } from "tsyringe";

import { ValidationError } from "../../../../domain/errors/validationError";
import { IReviewRepository } from "../../../../domain/repositoryInterfaces/review/review-repository.interface";
import { ERROR_MESSAGE } from "../../../../shared/constants";
import { GuideReviewAggregateResult } from "../../../dto/response/reviewDto";
import { IGetMyGuideReviewsUsecase } from "../../interfaces/review/get-my-guide-reviews.usecase.interface";

@injectable()
export class GetMyGuideReviewsUsecase implements IGetMyGuideReviewsUsecase {
  constructor(
    @inject("IReviewRepository")
    private _reviewRepository: IReviewRepository
  ) {}

  async execute(guideId: string): Promise<GuideReviewAggregateResult> {
    if (!guideId) {
      throw new ValidationError(ERROR_MESSAGE.ID_REQUIRED);
    }

    const aggregationResult = await this._reviewRepository.findByGuideId(guideId);

    if (!aggregationResult) {
      return { reviews: [], averageRating: 0, totalReviews: 0 };
    }

    return aggregationResult;
  }
}


