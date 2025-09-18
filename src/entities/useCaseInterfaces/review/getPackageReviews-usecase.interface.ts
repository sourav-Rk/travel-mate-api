import { ReviewListDto } from "../../../shared/dto/reviewDto";

export interface IGetPackageReviewsUsecase{
    execute(packageId : string) : Promise<ReviewListDto[] | []>;
}