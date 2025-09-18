import { IReviewModel } from "../../../frameworks/database/models/review.model";
import { ReviewListDto, ReviewListWithUserDetailsDto } from "../../../shared/dto/reviewDto";
import { IReviewEntity } from "../../modelsEntity/review.entity";

export interface IReviewRepository{
    save(data : Partial<IReviewEntity>) : Promise<IReviewEntity>;
    findByPackageIdAndUserId(userId : string,packageId : string) : Promise<IReviewEntity | null>;
    findByPackageId(packageId : string) : Promise<ReviewListWithUserDetailsDto[] | null>;
}