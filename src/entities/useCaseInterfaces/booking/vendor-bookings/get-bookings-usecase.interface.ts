import { BOOKINGSTATUS } from "../../../../shared/constants";
import { BookingListVendorDto, PaginatedBookingListWithUserDetails, PaginatedBookingListWithUserDetailsVendorDto } from "../../../../shared/dto/bookingDto";

export interface IGetBookingsVendorUsecase {
  execute(
    vendorId: string,
    packageId: string,
    searchTerm: string,
    status: BOOKINGSTATUS,
    pageNumber: number,
    pageSize: number
  ): Promise<PaginatedBookingListWithUserDetailsVendorDto>;
}
