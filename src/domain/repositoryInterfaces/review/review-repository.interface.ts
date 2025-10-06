import { ReviewListWithUserDetailsDto } from "../../../application/dto/response/reviewDto";
import { IReviewEntity } from "../../entities/review.entity";
import { IBaseRepository } from "../baseRepository.interface";

export interface IReviewRepository extends IBaseRepository<IReviewEntity> {
  findByPackageIdAndUserId(
    userId: string,
    packageId: string
  ): Promise<IReviewEntity | null>;
  findByPackageId(
    packageId: string
  ): Promise<ReviewListWithUserDetailsDto[] | null>;
  findByGuideIdAndUserId(
    userId: string,
    guideId: string
  ): Promise<IReviewEntity | null>;
  findByPackageIdAndGuideId(
    packageId: string,
    guideId: string
  ): Promise<ReviewListWithUserDetailsDto[] | null>;
}
