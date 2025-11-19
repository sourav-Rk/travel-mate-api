import { ILocalGuideProfileEntity } from "../../entities/local-guide-profile.entity";
import { IBaseRepository } from "../baseRepository.interface";

export interface ILocalGuideProfileRepository
  extends IBaseRepository<ILocalGuideProfileEntity> {
  findByUserId(userId: string): Promise<ILocalGuideProfileEntity | null>;
  findByVerificationStatus(
    status: "pending" | "reviewing" | "verified" | "rejected",
    page: number,
    limit: number,
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
  }>;
  findNearbyGuides(
    longitude: number,
    latitude: number,
    radiusInMeters: number,
    filters?: {
      isAvailable?: boolean;
      specialties?: string[];
      minRating?: number;
    }
  ): Promise<ILocalGuideProfileEntity[]>;
  updateVerificationStatus(
    profileId: string,
    status: "pending" | "reviewing" | "verified" | "rejected",
    rejectionReason?: string
  ): Promise<ILocalGuideProfileEntity | null>;
  updateAvailability(
    userId: string,
    isAvailable: boolean,
    availabilityNote?: string
  ): Promise<ILocalGuideProfileEntity | null>;
  updateByUserId(
    userId: string,
    data: Partial<ILocalGuideProfileEntity>,
    clearRejectionFields?: boolean
  ): Promise<ILocalGuideProfileEntity | null>;

  updateStats(
    profileId: string,
    stats: Partial<ILocalGuideProfileEntity["stats"]>
  ): Promise<ILocalGuideProfileEntity | null>;

  addBadge(profileId: string, badgeId: string): Promise<ILocalGuideProfileEntity | null>;

  getBadges(profileId: string): Promise<string[]>;
}
