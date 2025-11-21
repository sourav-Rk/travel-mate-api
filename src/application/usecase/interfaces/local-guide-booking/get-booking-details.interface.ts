import { LocalGuideBookingDto } from "../../../dto/response/local-guide-booking.dto";

export interface IGetLocalGuideBookingDetailsUsecase {
  execute(bookingId: string, userId: string): Promise<LocalGuideBookingDto>;
}







