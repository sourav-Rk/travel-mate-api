import {  ReviewListWithUserDetailsDto } from "../../../shared/dto/reviewDto";
import { IReviewEntity } from "../../modelsEntity/review.entity";
import { IBaseRepository } from "../baseRepository.interface";

export interface IReviewRepository extends IBaseRepository<IReviewEntity>{
    findByPackageIdAndUserId(userId : string,packageId : string) : Promise<IReviewEntity | null>;
    findByPackageId(packageId : string) : Promise<ReviewListWithUserDetailsDto[] | null>;
}