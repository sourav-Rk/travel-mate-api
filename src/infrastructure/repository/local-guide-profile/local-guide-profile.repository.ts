import { injectable } from "tsyringe";

import {
  AggregationResult,
  LocalGuideProfileMapper,
} from "../../../application/mapper/local-guide-profile.mapper";
import { ILocalGuideProfileEntity } from "../../../domain/entities/local-guide-profile.entity";
import { ILocalGuideProfileRepository } from "../../../domain/repositoryInterfaces/local-guide-profile/local-guide-profile-repository.interface";
import {
  ILocalGuideProfileModel,
  localGuideProfileDB,
} from "../../database/models/local-guide-profile.model";
import { BaseRepository } from "../baseRepository";
import { FilterQuery, PipelineStage } from "mongoose";

@injectable()
export class LocalGuideProfileRepository
  extends BaseRepository<ILocalGuideProfileModel, ILocalGuideProfileEntity>
  implements ILocalGuideProfileRepository
{
  constructor() {
    super(localGuideProfileDB, LocalGuideProfileMapper.toEntity);
  }

  async findByUserId(userId: string): Promise<ILocalGuideProfileEntity | null> {
    const profile = await localGuideProfileDB
      .findOne({ userId })
      .populate("userId", "firstName lastName email profileImage")
      .exec();
    if (!profile) return null;
    return LocalGuideProfileMapper.toEntity(profile);
  }

  async findByVerificationStatus(
    status: "pending" | "reviewing" | "verified" | "rejected",
    page: number = 1,
    limit: number = 10,
    searchTerm?: string
  ): Promise<{
    profiles: Array<{
      entity: ILocalGuideProfileEntity;
      userDetails?: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        profileImage?: string;
      };
    }>;
    total: number;
    currentPage: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;

    const baseQuery: FilterQuery<ILocalGuideProfileModel> = {
      verificationStatus: status,
    };

    const pipeline: PipelineStage[] = [
      {
        $match: baseQuery,
      },
      {
        $lookup: {
          from: "clients",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: {
          path: "$userDetails",
          preserveNullAndEmptyArrays: false,
        },
      },
    ];

    if (searchTerm && searchTerm.trim()) {
      const searchRegex = new RegExp(searchTerm.trim(), "i");
      pipeline.push({
        $match: {
          $or: [
            { "userDetails.firstName": searchRegex },
            { "userDetails.lastName": searchRegex },
            { "userDetails.email": searchRegex },
            { "location.city": searchRegex },
            { "location.state": searchRegex },
            { "location.country": searchRegex },
          ],
        },
      });
    }

    pipeline.push({
      $project: {
        _id: 1,
        userId: 1,
        verificationStatus: 1,
        verificationRequestedAt: 1,
        verifiedAt: 1,
        rejectedAt: 1,
        rejectionReason: 1,
        verificationDocuments: 1,
        location: 1,
        hourlyRate: 1,
        languages: 1,
        specialties: 1,
        bio: 1,
        profileImage: 1,
        isAvailable: 1,
        availabilityNote: 1,
        stats: 1,
        badges: 1,
        createdAt: 1,
        updatedAt: 1,
        "userDetails._id": 1,
        "userDetails.firstName": 1,
        "userDetails.lastName": 1,
        "userDetails.email": 1,
        "userDetails.profileImage": 1,
      },
    });

    pipeline.push(
      {
        $sort: { verificationRequestedAt: -1 },
      },
      {
        $facet: {
          profiles: [{ $skip: skip }, { $limit: limit }],
          total: [{ $count: "count" }],
        },
      }
    );

    const result = await localGuideProfileDB
      .aggregate<{ profiles: AggregationResult[]; total: { count: number }[] }>(
        pipeline
      )
      .exec();

    const profiles = result[0]?.profiles || [];
    const total = result[0]?.total[0]?.count || 0;

    return {
      profiles: profiles.map((profile) => ({
        entity: LocalGuideProfileMapper.toEntity(profile),
        userDetails: LocalGuideProfileMapper.extractUserDetails(profile),
      })),
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findNearbyGuides(
    longitude: number,
    latitude: number,
    radiusInMeters: number,
    filters?: {
      isAvailable?: boolean;
      specialties?: string[];
      minRating?: number;
    }
  ): Promise<ILocalGuideProfileEntity[]> {
    const query: FilterQuery<ILocalGuideProfileModel> = {
      verificationStatus: "verified",
    };

    if (filters?.isAvailable !== undefined) {
      query.isAvailable = filters.isAvailable;
    }

    if (filters?.specialties && filters.specialties.length > 0) {
      query.specialties = { $in: filters.specialties };
    }

    if (filters?.minRating !== undefined) {
      query["stats.averageRating"] = { $gte: filters.minRating };
    }

    const guides = await localGuideProfileDB.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          distanceField: "distance",
          maxDistance: radiusInMeters,
          query: query,
          spherical: true,
        },
      },
      {
        $lookup: {
          from: "clients",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails",
      },
      {
        $sort: { distance: 1 },
      },
    ]);

    return guides.map((guide) => LocalGuideProfileMapper.toEntity(guide));
  }

  async updateVerificationStatus(
    profileId: string,
    status: "pending" | "reviewing" | "verified" | "rejected",
    rejectionReason?: string
  ): Promise<ILocalGuideProfileEntity | null> {
    const updateData: FilterQuery<ILocalGuideProfileModel> = {
      verificationStatus: status,
    };

    if (status === "verified") {
      updateData.verifiedAt = new Date();
    } else if (status === "rejected") {
      updateData.rejectedAt = new Date();
      if (rejectionReason) {
        updateData.rejectionReason = rejectionReason;
      }
    } else if (status === "reviewing") {
    }

    const updated = await localGuideProfileDB
      .findByIdAndUpdate(profileId, updateData, { new: true })
      .populate("userId", "firstName lastName email profileImage")
      .exec();

    if (!updated) return null;
    return LocalGuideProfileMapper.toEntity(updated);
  }

  async updateAvailability(
    userId: string,
    isAvailable: boolean,
    availabilityNote?: string
  ): Promise<ILocalGuideProfileEntity | null> {
    const updateData: FilterQuery<ILocalGuideProfileModel> = {
      isAvailable,
      updatedAt: new Date(),
    };

    if (availabilityNote !== undefined) {
      updateData.availabilityNote = availabilityNote || undefined;
    }

    const updated = await localGuideProfileDB
      .findOneAndUpdate({ userId }, updateData, { new: true })
      .populate("userId", "firstName lastName email profileImage")
      .exec();

    if (!updated) return null;
    return LocalGuideProfileMapper.toEntity(updated);
  }

  async updateByUserId(
    userId: string,
    data: Partial<ILocalGuideProfileEntity>,
    clearRejectionFields: boolean = false
  ): Promise<ILocalGuideProfileEntity | null> {
  
    const updateData: FilterQuery<ILocalGuideProfileModel> = {
      updatedAt: new Date(),
    };

    
    Object.keys(data).forEach((key) => {
      const value = (data as any)[key];
      if (value !== undefined) {
        updateData[key] = value;
      }
    });


    if (clearRejectionFields) {
      updateData.rejectedAt = null;
      updateData.rejectionReason = null;
    }

    const updated = await localGuideProfileDB
      .findOneAndUpdate({ userId }, updateData, { new: true })
      .populate("userId", "firstName lastName email profileImage")
      .exec();

    if (!updated) return null;
    return LocalGuideProfileMapper.toEntity(updated);
  }
}
