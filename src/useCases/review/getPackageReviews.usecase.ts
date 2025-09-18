import { inject, injectable } from "tsyringe";
import { IGetPackageReviewsUsecase } from "../../entities/useCaseInterfaces/review/getPackageReviews-usecase.interface";
import { IReviewRepository } from "../../entities/repositoryInterfaces/review/review-repository.interface";
import { ReviewListDto } from "../../shared/dto/reviewDto";
import { IPackageRepository } from "../../entities/repositoryInterfaces/package/package-repository.interface";
import { ValidationError } from "../../shared/utils/error/validationError";
import { ERROR_MESSAGE } from "../../shared/constants";
import { NotFoundError } from "../../shared/utils/error/notFoundError";
import { ReviewMapper } from "../../interfaceAdapters/mappers/review.mapper";

@injectable()
export class GetPackageReviewsUsecase implements IGetPackageReviewsUsecase {
  constructor(
    @inject("IReviewRepository")
    private _reviewRepository: IReviewRepository,

    @inject("IPackageRepository")
    private _packageRepository: IPackageRepository
  ) {}

  async execute(packageId: string): Promise<ReviewListDto[] | []> {
    if (!packageId) {
      throw new ValidationError(ERROR_MESSAGE.ID_REQUIRED);
    }

    const packageExists = await this._packageRepository.findByPackageId(
      packageId
    );

    if (!packageExists) {
      throw new NotFoundError(ERROR_MESSAGE.PACKAGE_NOT_FOUND);
    }

    const reviews = await this._reviewRepository.findByPackageId(packageId);

    return reviews
      ? reviews.map((doc) => ReviewMapper.mapToReviewListDto(doc))
      : [];
  }
}
