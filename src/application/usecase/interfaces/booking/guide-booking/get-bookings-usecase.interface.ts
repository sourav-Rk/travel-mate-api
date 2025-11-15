import { BOOKINGSTATUS } from "../../../../../shared/constants";
import { PaginatedBookingListWithUserDetailsGuideDto } from "../../../../dto/response/bookingDto";

export interface IGetBookingsGuideUsecase {
  execute(
    guideId: string,
    packageId: string,
    searchTerm: string,
    status: BOOKINGSTATUS,
    pageNumber: number,
    pageSize: number
  ): Promise<PaginatedBookingListWithUserDetailsGuideDto>;
}
