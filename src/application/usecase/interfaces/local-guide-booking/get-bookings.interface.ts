import { LocalGuideBookingListFilters, } from "../../../../shared/constants";
import { LocalGuideBookingListResult } from "../../../dto/response/local-guide-booking.dto";

export interface IGetLocalGuideBookingsUsecase {
  execute(
    travellerId: string,
    filters: LocalGuideBookingListFilters
  ): Promise<LocalGuideBookingListResult>;
}














