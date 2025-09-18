import { inject, injectable } from "tsyringe";
import { IAddReviewUsecase } from "../../entities/useCaseInterfaces/review/add-review-usecase.interface";
import { ERROR_MESSAGE, REVIEWTARGET } from "../../shared/constants";
import { ValidationError } from "../../shared/utils/error/validationError";
import { IClientRepository } from "../../entities/repositoryInterfaces/client/client.repository.interface";
import { IPackageRepository } from "../../entities/repositoryInterfaces/package/package-repository.interface";
import { NotFoundError } from "../../shared/utils/error/notFoundError";
import { IReviewRepository } from "../../entities/repositoryInterfaces/review/review-repository.interface";

@injectable()
export class AddReviewUsecase implements IAddReviewUsecase {
  constructor(
    @inject("IClientRepository")
    private _clientRepository: IClientRepository,

    @inject("IPackageRepository")
    private _packageRepository: IPackageRepository,

    @inject("IReviewRepository")
    private _reviewRepository: IReviewRepository
  ) {}

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

    //check user exist
    const user = await this._clientRepository.findById(userId);
    if (!user) {
      throw new NotFoundError(ERROR_MESSAGE.USER_NOT_FOUND);
    }

    if (targetType === "package" && packageId) {
      const packageExisting = await this._packageRepository.findByPackageId(
        packageId
      );
      if (!packageExisting) {
        throw new NotFoundError(ERROR_MESSAGE.PACKAGE_NOT_FOUND);
      }
     
      const reviewExist = await this._reviewRepository.findByPackageIdAndUserId(userId,packageId);

      if(reviewExist){
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
}
