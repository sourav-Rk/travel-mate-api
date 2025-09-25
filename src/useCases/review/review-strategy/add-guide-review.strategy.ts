import { inject, injectable } from "tsyringe";
import { IReviewStrategy } from "./review-strategy.interface";
import { IGuideRepository } from "../../../entities/repositoryInterfaces/guide/guide-repository.interface";
import { IReviewRepository } from "../../../entities/repositoryInterfaces/review/review-repository.interface";
import { ERROR_MESSAGE, REVIEWTARGET } from "../../../shared/constants";
import { IClientRepository } from "../../../entities/repositoryInterfaces/client/client.repository.interface";
import { ValidationError } from "../../../shared/utils/error/validationError";
import { NotFoundError } from "../../../shared/utils/error/notFoundError";

@injectable()
export class AddGuideReviewStrategy implements IReviewStrategy {
  constructor(
    @inject("IGuideRepository")
    private _guideRepository: IGuideRepository,

    @inject("IReviewRepository")
    private _reviewRepository: IReviewRepository,

    @inject("IClientRepository")
    private _clientRepository: IClientRepository
  ) {}

  async addReview(
    userId: string,
    targetType: REVIEWTARGET,
    rating: number,
    comment: string,
    packageId?: string,
    guideId?: string
  ): Promise<void> {

    const user = await this._clientRepository.findById(userId);
    if (!user) {
      throw new NotFoundError(ERROR_MESSAGE.USER_NOT_FOUND);
    }

    const guideExist = await this._guideRepository.findById(guideId!);

    console.log(guideExist,"-->guuide")
    if (!guideExist) {
      throw new NotFoundError(ERROR_MESSAGE.GUIDE_NOT_FOUND);
    }

    const reviewExist = await this._reviewRepository.findByGuideIdAndUserId(
      userId,
      guideId!
    );
    if (reviewExist) {
      throw new ValidationError(ERROR_MESSAGE.ALREADY_REVIEWED);
    }

    await this._reviewRepository.save({ userId, targetType, rating, comment,guideId,packageId });
  }
}
