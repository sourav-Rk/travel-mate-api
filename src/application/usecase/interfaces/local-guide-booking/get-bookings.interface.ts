import { LocalGuideBookingListFilters, LocalGuideBookingListResult } from "../../../../shared/constants";

export interface IGetLocalGuideBookingsUsecase {
  execute(
    travellerId: string,
    filters: LocalGuideBookingListFilters
  ): Promise<LocalGuideBookingListResult>;
}







