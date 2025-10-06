import { BookingDetailsDto } from "../../../../dto/response/bookingDto";

export interface IGetClientBookingDetailsUsecase {
  execute(userId: string, bookingId: string): Promise<BookingDetailsDto>;
}
