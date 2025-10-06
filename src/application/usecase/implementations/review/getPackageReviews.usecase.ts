import { inject, injectable } from "tsyringe";
import { IGetPackageReviewsUsecase } from "../../interfaces/review/getPackageReviews-usecase.interface";
import { IReviewRepository } from "../../../../domain/repositoryInterfaces/review/review-repository.interface";
import { ReviewListDto } from "../../../dto/response/reviewDto";
import { IPackageRepository } from "../../../../domain/repositoryInterfaces/package/package-repository.interface";
import { ValidationError } from "../../../../domain/errors/validationError";
import { ERROR_MESSAGE } from "../../../../shared/constants";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ReviewMapper } from "../../../mapper/review.mapper";

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
