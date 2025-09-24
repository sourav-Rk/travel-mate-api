import { BOOKINGSTATUS } from "../../../../shared/constants";
import { PaginatedBookingListWithUserDetailsGuideDto } from "../../../../shared/dto/bookingDto";

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
