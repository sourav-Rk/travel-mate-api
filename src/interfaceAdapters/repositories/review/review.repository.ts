import { injectable } from "tsyringe";
import { IReviewRepository } from "../../../entities/repositoryInterfaces/review/review-repository.interface";
import { IReviewEntity } from "../../../entities/modelsEntity/review.entity";
import { reviewDB } from "../../../frameworks/database/models/review.model";
import { ReviewMapper } from "../../mappers/review.mapper";
import { ReviewListWithUserDetailsDto } from "../../../shared/dto/reviewDto";

@injectable()
export class ReviewRepository implements IReviewRepository {
  async save(data: Partial<IReviewEntity>): Promise<IReviewEntity> {
    const modelData = await reviewDB.create(data);
    return ReviewMapper.toEntity(modelData);
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
      .find({ packageId })
      .populate("userId")
      .lean<ReviewListWithUserDetailsDto[]>();
    return modelData;
  }
}
