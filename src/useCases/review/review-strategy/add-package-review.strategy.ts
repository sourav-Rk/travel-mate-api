import { inject, injectable } from "tsyringe";
import { IReviewStrategy } from "./review-strategy.interface";
import { IClientRepository } from "../../../entities/repositoryInterfaces/client/client.repository.interface";
import { IReviewRepository } from "../../../entities/repositoryInterfaces/review/review-repository.interface";
import { IPackageRepository } from "../../../entities/repositoryInterfaces/package/package-repository.interface";
import { ERROR_MESSAGE, REVIEWTARGET } from "../../../shared/constants";
import { ValidationError } from "../../../shared/utils/error/validationError";
import { NotFoundError } from "../../../shared/utils/error/notFoundError";

@injectable()
export class AddPackageReviewStrategy implements IReviewStrategy {
  constructor(
    @inject("IClientRepository")
    private _clientRepository: IClientRepository,

    @inject("IPackageRepository")
    private _packageRepository: IPackageRepository,

    @inject("IReviewRepository")
    private _reviewRepository: IReviewRepository
  ) {}

  async addReview(
    userId: string,
    targetType: REVIEWTARGET,
    rating: number,
    comment: string,
    packageId?: string,
    guideId?: string
  ): Promise<void> {
    
    const packageExisting = await this._packageRepository.findByPackageId(
      packageId!
    );
    if (!packageExisting) {
      throw new NotFoundError(ERROR_MESSAGE.PACKAGE_NOT_FOUND);
    }

    const reviewExist = await this._reviewRepository.findByPackageIdAndUserId(
      userId,
      packageId!
    );

    if (reviewExist) {
      throw new ValidationError(ERROR_MESSAGE.ALREADY_REVIEWED);
    }

    await this._reviewRepository.save({
      userId,
      packageId,
      targetType,
      rating,
      comment,
    });
  }
}
