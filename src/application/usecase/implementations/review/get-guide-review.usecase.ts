import { inject, injectable } from "tsyringe";

import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ValidationError } from "../../../../domain/errors/validationError";
import { IPackageRepository } from "../../../../domain/repositoryInterfaces/package/package-repository.interface";
import { IReviewRepository } from "../../../../domain/repositoryInterfaces/review/review-repository.interface";
import { ERROR_MESSAGE } from "../../../../shared/constants";
import { ReviewListDto } from "../../../dto/response/reviewDto";
import { ReviewMapper } from "../../../mapper/review.mapper";
import { IGetGuideReviewUsecase } from "../../interfaces/review/get-guide-reviews.usecase";

@injectable()
export class GetGuideReviewsUsecase implements IGetGuideReviewUsecase {
  constructor(
    @inject("IReviewRepository")
    private _reviewRepository: IReviewRepository,

    @inject("IPackageRepository")
    private _packageRepository: IPackageRepository
  ) {}

  async execute(
    packageId: string,
    guideId: string
  ): Promise<ReviewListDto[] | []> {
    if (!packageId) {
      throw new ValidationError(ERROR_MESSAGE.ID_REQUIRED);
    }

    const packageExists = await this._packageRepository.findByPackageId(
      packageId
    );

    if (!packageExists) {
      throw new NotFoundError(ERROR_MESSAGE.PACKAGE_NOT_FOUND);
    }

    const reviews = await this._reviewRepository.findByPackageIdAndGuideId(
      packageId,
      guideId
    );

    return reviews
      ? reviews.map((doc) => ReviewMapper.mapToReviewListDto(doc))
      : [];
  }
}
