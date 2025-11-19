import { ILocalGuideProfileEntity } from "../../../domain/entities/local-guide-profile.entity";
import { TVerificationStatus, VERIFICATION_STATUS } from "../../../shared/constants";

export interface LocalGuideProfileDto {
  _id: string;
  userId: string;
  userDetails?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    profileImage?: string;
  };
  verificationStatus: TVerificationStatus
  verificationRequestedAt: Date;
  verifiedAt?: Date;
  rejectedAt?: Date;
  rejectionReason?: string;
  verificationDocuments: {
    idProof: string;
    addressProof: string;
    additionalDocuments?: string[];
  };
  location: {
    type: "Point";
    coordinates: [number, number];
    city: string;
    state: string;
    country: string;
    address?: string;
    formattedAddress?: string;
  };
  hourlyRate: number;
  languages: string[];
  specialties: string[];
  bio?: string;
  profileImage?: string;
  isAvailable: boolean;
  availabilityNote?: string;
  stats: {
    totalSessions: number;
    completedSessions: number;
    averageRating: number;
    totalRatings: number;
    totalPosts: number;
    totalEarnings: number;
  };
  badges: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PendingVerificationsResponseDto {
  profiles: LocalGuideProfileDto[];
  total: number;
  currentPage: number;
  totalPages: number;
}

export interface LocalGuideVerificationResponseDto {
  message: string;
  profile: LocalGuideProfileDto;
}


// volunteer-post.dto.ts
export interface LocalGuideDetailsDto {
  _id: string;
  userId?: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImage?: string;
  bio?: string;
  specialties?: string[];
  languages?: string[];
  hourlyRate?: number;
}

