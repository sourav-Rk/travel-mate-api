import { LocalGuideBookingListFilters } from "../../../shared/constants";
import { ILocalGuideBookingEntity } from "../../entities/local-guide-booking.entity";
import { IBaseRepository } from "../baseRepository.interface";

export interface ILocalGuideBookingRepository
  extends IBaseRepository<ILocalGuideBookingEntity> {
  create(
    booking: Omit<
      ILocalGuideBookingEntity,
      "_id" | "bookingId" | "createdAt" | "updatedAt"
    >
  ): Promise<ILocalGuideBookingEntity>;

  findByBookingId(bookingId: string): Promise<ILocalGuideBookingEntity | null>;

  findByQuoteId(quoteId: string): Promise<ILocalGuideBookingEntity | null>;

  findByTravellerId(
    travellerId: string
  ): Promise<ILocalGuideBookingEntity[]>;

  findByGuideId(guideId: string): Promise<ILocalGuideBookingEntity[]>;

  findByGuideChatRoomId(
    guideChatRoomId: string
  ): Promise<ILocalGuideBookingEntity | null>;

  checkOverlaps(
    guideId: string,
    sessionDate: Date,
    sessionTime: string,
    hours: number,
    excludeBookingId?: string
  ): Promise<ILocalGuideBookingEntity[]>;

  findWithFilters(
    travellerId: string,
    filters: LocalGuideBookingListFilters
  ): Promise<{
    bookings: ILocalGuideBookingEntity[];
    pagination: {
      total: number;
      totalPages: number;
      page: number;
      limit : number;
    };
    summary: {
      pendingCount: number;
      completedCount: number;
    };
  }>;

  findGuideBookingsWithFilters(
    guideProfileId: string,
    filters: LocalGuideBookingListFilters
  ): Promise<{
    bookings: ILocalGuideBookingEntity[];
    pagination: {
      total: number;
      totalPages: number;
      page: number;
      limit: number;
    };
    summary: {
      pendingCount: number;
      completedCount: number;
    };
  }>;

  updateByBookingId(
    id: string,
    data: Partial<ILocalGuideBookingEntity>
  ): Promise<ILocalGuideBookingEntity | null>;

  getServiceStats(
    guideProfileId: string
  ): Promise<{
    totalSessions: number;
    completedSessions: number;
    completionRate: number;
  }>;

  getEarningsStats(
    guideProfileId: string
  ): Promise<{
    totalEarnings: number;
  }>;

  getRatingStats(
    guideProfileId: string
  ): Promise<{
    averageRating: number;
    totalRatings: number;
  }>;
}

