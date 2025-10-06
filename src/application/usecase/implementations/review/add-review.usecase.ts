import { inject, injectable } from "tsyringe";
import { IAddReviewUsecase } from "../../interfaces/review/add-review-usecase.interface";
import { ERROR_MESSAGE, REVIEWTARGET } from "../../../../shared/constants";
import { IReviewStrategy } from "./review-strategy/review-strategy.interface";
import { ValidationError } from "../../../../domain/errors/validationError";

@injectable()
export class AddReviewUsecase implements IAddReviewUsecase {
  private _strategies: Record<string, IReviewStrategy>;
  constructor(
    @inject("AddPackageReviewStrategy")
    private _addPackageReviewStrategy: IReviewStrategy,

    @inject("AddGuideReviewStrategy")
    private _addGuideReviewStrategy: IReviewStrategy
  ) {
    this._strategies = {
      package: this._addPackageReviewStrategy,
      guide: this._addGuideReviewStrategy,
    };
  }

  async execute(
    userId: string,
    targetType: REVIEWTARGET,
    rating: number,
    comment: string,
    packageId?: string,
    guideId?: string
  ): Promise<void> {
    if (!userId || !targetType || !rating) {
      throw new ValidationError(ERROR_MESSAGE.REQUIRED_FIELDS_MISSING);
    }

    const strategy = this._strategies[targetType];
    if (!strategy) {
      throw new ValidationError(ERROR_MESSAGE.INVALID_USER_ROLE);
    }

    await strategy.addReview(
      userId,
      targetType,
      rating,
      comment,
      packageId,
      guideId
    );
  }
}
