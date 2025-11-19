import { LocalGuideBookingDto, LocalGuideBookingStatus } from "../../../dto/response/local-guide-booking.dto";

export type LocalGuideBookingCategory = "pending" | "completed";

export type LocalGuidePaymentFilter =
  | "advance_due"
  | "advance_overdue"
  | "full_due"
  | "full_paid";

export interface LocalGuideBookingListFilters {
  category?: LocalGuideBookingCategory;
  status?: LocalGuideBookingStatus;
  paymentStatus?: LocalGuidePaymentFilter;
  search?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export interface LocalGuideBookingListResult {
  bookings: LocalGuideBookingDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  summary: {
    pendingCount: number;
    completedCount: number;
  };
}

export interface IGetLocalGuideBookingsForGuideUsecase {
  execute(
    guideId: string,
    filters: LocalGuideBookingListFilters
  ): Promise<LocalGuideBookingListResult>;
}




