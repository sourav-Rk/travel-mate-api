import { inject, injectable } from "tsyringe";
import { IReviewRepository } from "../../entities/repositoryInterfaces/review/review-repository.interface";
import { ReviewListDto } from "../../shared/dto/reviewDto";
import { IPackageRepository } from "../../entities/repositoryInterfaces/package/package-repository.interface";
import { ValidationError } from "../../shared/utils/error/validationError";
import { ERROR_MESSAGE } from "../../shared/constants";
import { NotFoundError } from "../../shared/utils/error/notFoundError";
import { ReviewMapper } from "../../interfaceAdapters/mappers/review.mapper";
import { IGetGuideReviewUsecase } from "../../entities/useCaseInterfaces/review/get-guide-reviews.usecase";

@injectable()
export class GetGuideReviewsUsecase implements IGetGuideReviewUsecase {
  constructor(
    @inject("IReviewRepository")
    private _reviewRepository: IReviewRepository,

    @inject("IPackageRepository")
    private _packageRepository: IPackageRepository,

  ) {}

  async execute(packageId: string, guideId: string): Promise<ReviewListDto[] | []> {
    if (!packageId) {
      throw new ValidationError(ERROR_MESSAGE.ID_REQUIRED);
    }

    const packageExists = await this._packageRepository.findByPackageId(
      packageId
    );

    if (!packageExists) {
      throw new NotFoundError(ERROR_MESSAGE.PACKAGE_NOT_FOUND);
    }

    const reviews = await this._reviewRepository.findByPackageIdAndGuideId(packageId,guideId);

    return reviews
      ? reviews.map((doc) => ReviewMapper.mapToReviewListDto(doc))
      : [];
  }
}
