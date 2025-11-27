import { LocalGuideBookingListResult, LocalGuideBookingStatus } from "../../../dto/response/local-guide-booking.dto";

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


export interface IGetLocalGuideBookingsForGuideUsecase {
  execute(
    clientId: string,
    filters: LocalGuideBookingListFilters
  ): Promise<LocalGuideBookingListResult>;
}













