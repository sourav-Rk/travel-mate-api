import { injectable } from "tsyringe";

import {
  ReviewAggregateResult,
  ReviewListWithUserDetailsDto,
} from "../../../application/dto/response/reviewDto";
import { ReviewMapper } from "../../../application/mapper/review.mapper";
import { IReviewEntity } from "../../../domain/entities/review.entity";
import { IReviewRepository } from "../../../domain/repositoryInterfaces/review/review-repository.interface";
import { IReviewModel, reviewDB } from "../../database/models/review.model";
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
  ): Promise<ReviewAggregateResult | null> {
    const aggregation = await reviewDB.aggregate([
      { $match: { packageId, targetType: "package" } },
      {
        $lookup: {
          from: "clients",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: "$userDetails" },
      {
        $project: {
          _id: 1,
          rating: 1,
          comment: 1,
          createdAt: 1,
          "userDetails._id": 1,
          "userDetails.firstName": 1,
          "userDetails.lastName": 1,
          "userDetails.profileImage": 1,
        },
      },
      {
        $group: {
          _id: null,
          reviews: { $push: "$$ROOT" },
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          reviews: 1,
          averageRating: { $ifNull: ["$averageRating", 0] },
          totalReviews: 1,
        },
      },
    ]);

    if (aggregation.length === 0) {
      return { reviews: [], averageRating: 0, totalReviews: 0 };
    }

    return aggregation[0];
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
  ): Promise<ReviewAggregateResult | null> {

     const aggregation = await reviewDB.aggregate([
      { $match: { packageId,guideId, targetType: "guide" } },
      {
        $lookup: {
          from: "clients",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: "$userDetails" },
      {
        $project: {
          _id: 1,
          rating: 1,
          comment: 1,
          createdAt: 1,
          "userDetails._id": 1,
          "userDetails.firstName": 1,
          "userDetails.lastName": 1,
          "userDetails.profileImage": 1,
        },
      },
      {
        $group: {
          _id: null,
          reviews: { $push: "$$ROOT" },
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          reviews: 1,
          averageRating: { $ifNull: ["$averageRating", 0] },
          totalReviews: 1,
        },
      },
    ]);

    if (aggregation.length === 0) {
      return { reviews: [], averageRating: 0, totalReviews: 0 };
    }

    return aggregation[0];

  }

  async getRatingStatsByGuideId(
    guideId: string
  ): Promise<{
    averageRating: number;
    totalRatings: number;
  }> {
    const aggregation = await reviewDB.aggregate([
      {
        $match: {
          guideId,
          targetType: "guide",
        },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalRatings: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          averageRating: { $ifNull: ["$averageRating", 0] },
          totalRatings: { $ifNull: ["$totalRatings", 0] },
        },
      },
    ]);

    if (aggregation.length === 0) {
      return { averageRating: 0, totalRatings: 0 };
    }

    const result = aggregation[0];
    return {
      averageRating: Math.round((result.averageRating || 0) * 100) / 100,
      totalRatings: result.totalRatings || 0,
    };
  }
}
