import { injectable } from "tsyringe";
import { IReviewRepository } from "../../../entities/repositoryInterfaces/review/review-repository.interface";
import { IReviewEntity } from "../../../entities/modelsEntity/review.entity";
import {
  IReviewModel,
  reviewDB,
} from "../../../frameworks/database/models/review.model";
import { ReviewMapper } from "../../mappers/review.mapper";
import { ReviewListWithUserDetailsDto } from "../../../shared/dto/reviewDto";
import { BaseRepository } from "../baseRepository";

@injectable()
export class ReviewRepository
  extends BaseRepository<IReviewModel, IReviewEntity>
  implements IReviewRepository
{
  constructor() {
    super(reviewDB, ReviewMapper.toEntity);
  }

  async findByPackageIdAndUserId(
    userId: string,
    packageId: string
  ): Promise<IReviewEntity | null> {
    return reviewDB.findOne({ userId, packageId });
  }

  async findByPackageId(
    packageId: string
  ): Promise<ReviewListWithUserDetailsDto[] | null> {
    const modelData = await reviewDB
      .find({ packageId,targetType : "package" })
      .populate("userId")
      .lean<ReviewListWithUserDetailsDto[]>();
    return modelData;
  }

  async findByGuideIdAndUserId(
    userId: string,
    guideId: string
  ): Promise<IReviewEntity | null> {
    return await reviewDB.findOne({ userId, guideId });
  }

  async findByPackageIdAndGuideId(
    packageId: string,
    guideId: string
  ): Promise<ReviewListWithUserDetailsDto[] | null> {
    const modelData = await reviewDB
      .find({ packageId, guideId,targetType : "guide" })
      .populate("userId")
      .lean<ReviewListWithUserDetailsDto[]>();

    return modelData;
  }
}
