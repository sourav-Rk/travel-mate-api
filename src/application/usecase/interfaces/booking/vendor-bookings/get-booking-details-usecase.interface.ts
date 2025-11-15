import { BookingDetailsWithUserDetailsDto } from "../../../../dto/response/bookingDto";

export interface IGetBookingDetailsVendorUsecase {
  execute(bookingId: string): Promise<BookingDetailsWithUserDetailsDto | null>;
}
