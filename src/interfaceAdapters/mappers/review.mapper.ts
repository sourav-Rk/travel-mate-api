import { IReviewEntity } from "../../entities/modelsEntity/review.entity";
import { IReviewModel } from "../../frameworks/database/models/review.model";
import { ReviewListDto, ReviewListWithUserDetailsDto } from "../../shared/dto/reviewDto";

export class ReviewMapper {
  static toEntity(doc: IReviewModel): IReviewEntity {
    return {
      _id: String(doc._id),
      rating: doc.rating,
      userId: String(doc.userId),
      comment: doc.comment!,
      targetType: doc.targetType,
      packageId: doc.packageId ?? "",
      guideId: doc.guideId ?? "",
      createdAt: doc.createdAt,
    };
  }

  static mapToReviewListDto(doc: ReviewListWithUserDetailsDto): ReviewListDto {
    return {
      _id: String(doc._id),
      userId :{
        _id : doc.userId._id,
        firstName : doc.userId.firstName,
        lastName : doc.userId.lastName
      },
      rating: doc.rating,
      comment: doc.comment!,
      createdAt: doc.createdAt!,
    };
  }
}
