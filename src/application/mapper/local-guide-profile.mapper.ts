import { ILocalGuideProfileEntity } from "../../domain/entities/local-guide-profile.entity";
import { ILocalGuideProfileModel } from "../../infrastructure/database/models/local-guide-profile.model";
import { TVerificationStatus } from "../../shared/constants";
import { LocalGuideProfileDto } from "../dto/response/local-guide.dto";

export type AggregationResult = {
  _id: unknown;
  userId: unknown;
  userDetails?: {
    _id: unknown;
    firstName: string;
    lastName: string;
    email: string;
    profileImage?: string;
  };
  verificationStatus: string;
  verificationRequestedAt?: Date;
  verifiedAt?: Date | null;
  rejectedAt?: Date | null;
  rejectionReason?: string | null;
  verificationDocuments: {
    idProof: string;
    addressProof: string;
    additionalDocuments?: string[];
  };
  location: {
    type: string;
    coordinates: number[];
    city: string;
    state: string;
    country: string;
    address?: string | null;
    formattedAddress?: string | null;
  };
  hourlyRate: number;
  languages: string[];
  specialties: string[];
  bio?: string | null;
  profileImage?: string | null;
  isAvailable: boolean;
  availabilityNote?: string | null;
  stats: {
    totalSessions: number;
    completedSessions: number;
    averageRating: number;
    totalRatings: number;
    totalPosts: number;
    totalEarnings: number;
  };
  badges: string[];
  createdAt?: Date;
  updatedAt?: Date;
  distance?: number;
};

export class LocalGuideProfileMapper {
  static toEntity(
    doc: ILocalGuideProfileModel | AggregationResult
  ): ILocalGuideProfileEntity {

    let userIdValue: string;
    if (
      typeof doc.userId === "object" &&
      doc.userId !== null &&
      "_id" in doc.userId
    ) {
      userIdValue = String((doc.userId as { _id: unknown })._id);
    } else {
      userIdValue = String(doc.userId);
    }

    return {
      _id: String(doc._id),
      userId: userIdValue,
      verificationStatus: doc.verificationStatus as TVerificationStatus,
      verificationRequestedAt: doc.verificationRequestedAt,
      verifiedAt: doc.verifiedAt || undefined,
      rejectedAt: doc.rejectedAt || undefined,
      rejectionReason: doc.rejectionReason || undefined,
      verificationDocuments: {
        idProof: doc.verificationDocuments.idProof,
        addressProof: doc.verificationDocuments.addressProof,
        additionalDocuments: doc.verificationDocuments.additionalDocuments || [],
      },
      location: {
        type: doc.location.type as "Point",
        coordinates: doc.location.coordinates as [number, number],
        city: doc.location.city,
        state: doc.location.state,
        country: doc.location.country,
        address: doc.location.address || undefined,
        formattedAddress: doc.location.formattedAddress || undefined,
      },
      hourlyRate: doc.hourlyRate,
      languages: doc.languages || [],
      specialties: doc.specialties || [],
      bio: doc.bio || undefined,
      profileImage: doc.profileImage || undefined,
      isAvailable: doc.isAvailable,
      availabilityNote: doc.availabilityNote || undefined,
      stats: {
        totalSessions: doc.stats.totalSessions,
        completedSessions: doc.stats.completedSessions,
        averageRating: doc.stats.averageRating,
        totalRatings: doc.stats.totalRatings,
        totalPosts: doc.stats.totalPosts,
        totalEarnings: doc.stats.totalEarnings,
      },
      badges: doc.badges || [],
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  static toDto(
    entity: ILocalGuideProfileEntity,
    userDetails?: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
      profileImage?: string;
    }
  ): LocalGuideProfileDto {
    return {
      _id: entity._id || "",
      userId: entity.userId,
      userDetails: userDetails,
      verificationStatus: entity.verificationStatus,
      verificationRequestedAt: entity.verificationRequestedAt || new Date(),
      verifiedAt: entity.verifiedAt,
      rejectedAt: entity.rejectedAt,
      rejectionReason: entity.rejectionReason,
      verificationDocuments: entity.verificationDocuments,
      location: entity.location,
      hourlyRate: entity.hourlyRate,
      languages: entity.languages,
      specialties: entity.specialties,
      bio: entity.bio,
      profileImage: entity.profileImage,
      isAvailable: entity.isAvailable,
      availabilityNote: entity.availabilityNote,
      stats: entity.stats,
      badges: entity.badges,
      createdAt: entity.createdAt || new Date(),
      updatedAt: entity.updatedAt || new Date(),
    };
  }

  static extractUserDetails(doc: ILocalGuideProfileModel | AggregationResult): {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    profileImage?: string;
  } | undefined {
    if ("userDetails" in doc && doc.userDetails) {
      return {
        _id: String(doc.userDetails._id),
        firstName: doc.userDetails.firstName,
        lastName: doc.userDetails.lastName,
        email: doc.userDetails.email,
        profileImage: doc.userDetails.profileImage,
      };
    }
    return undefined;
  }
}
