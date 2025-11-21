import { inject, injectable } from "tsyringe";

import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ValidationError } from "../../../../domain/errors/validationError";
import { IPackageRepository } from "../../../../domain/repositoryInterfaces/package/package-repository.interface";
import { IReviewRepository } from "../../../../domain/repositoryInterfaces/review/review-repository.interface";
import { ERROR_MESSAGE } from "../../../../shared/constants";
import {
  PackageReviewListWithUserDetailsAndAverageRatingDto,
} from "../../../dto/response/reviewDto";
import { ReviewMapper } from "../../../mapper/review.mapper";
import { IGetPackageReviewsUsecase } from "../../interfaces/review/getPackageReviews-usecase.interface";

@injectable()
export class GetPackageReviewsUsecase implements IGetPackageReviewsUsecase {
  constructor(
    @inject("IReviewRepository")
    private _reviewRepository: IReviewRepository,

    @inject("IPackageRepository")
    private _packageRepository: IPackageRepository
  ) {}

  async execute(
    packageId: string
  ): Promise<PackageReviewListWithUserDetailsAndAverageRatingDto> {
    if (!packageId) {
      throw new ValidationError(ERROR_MESSAGE.ID_REQUIRED);
    }

    const packageExists = await this._packageRepository.findByPackageId(
      packageId
    );

    if (!packageExists) {
      throw new NotFoundError(ERROR_MESSAGE.PACKAGE_NOT_FOUND);
    }

    const aggregationResult = await this._reviewRepository.findByPackageId(
      packageId
    );

    if (!aggregationResult) {
      return { reviews: [], averageRating: 0, totalReviews: 0 };
    }

    const { reviews, averageRating, totalReviews } = aggregationResult;

    const mappedReviews = reviews.map((doc) =>
      ReviewMapper.mapToReviewListDto(doc)
    );

    return {
      reviews: mappedReviews,
      averageRating,
      totalReviews,
    };
  }
}
