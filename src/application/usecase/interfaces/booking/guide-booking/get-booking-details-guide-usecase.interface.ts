import { BookingDetailsWithUserDetailsDto } from "../../../../dto/response/bookingDto";

export interface IGetBookingDetailsGuideUsecase {
  execute(
    bookingId: string,
    guideId: string
  ): Promise<BookingDetailsWithUserDetailsDto | null>;
}
