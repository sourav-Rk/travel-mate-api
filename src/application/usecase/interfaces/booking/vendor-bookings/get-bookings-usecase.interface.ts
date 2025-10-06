import { BOOKINGSTATUS } from "../../../../../shared/constants";
import {
  BookingListVendorDto,
  PaginatedBookingListWithUserDetails,
  PaginatedBookingListWithUserDetailsVendorDto,
} from "../../../../dto/response/bookingDto";

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
