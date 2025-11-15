import { TVerificationStatus } from "../../shared/constants";

export interface ILocation {
  type: "Point";
  coordinates: [number, number]; // [longitude, latitude]
  city: string;
  state: string;
  country: string;
  address?: string;
  formattedAddress?: string;
}

export interface IVerificationDocuments {
  idProof: string;
  addressProof: string;
  additionalDocuments?: string[];
}

export interface IGuideStats {
  totalSessions: number;
  completedSessions: number;
  averageRating: number;
  totalRatings: number;
  totalPosts: number;
  totalEarnings: number;
}

export interface ILocalGuideProfileEntity {
  _id?: string;
  userId: string;
  verificationStatus: TVerificationStatus;
  verificationRequestedAt?: Date;
  verifiedAt?: Date;
  rejectedAt?: Date;
  rejectionReason?: string;
  verificationDocuments: IVerificationDocuments;
  location: ILocation;
  hourlyRate: number;
  languages: string[];
  specialties: string[];
  bio?: string;
  profileImage?: string;
  isAvailable: boolean;
  availabilityNote?: string;
  stats: IGuideStats;
  badges: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

