import {
  PackageReviewListWithUserDetailsAndAverageRatingDto,
} from "../../../dto/response/reviewDto";

export interface IGetPackageReviewsUsecase {
  execute(
    packageId: string
  ): Promise<PackageReviewListWithUserDetailsAndAverageRatingDto>;
}
