import { LocalGuideBookingDto } from "../../../dto/response/local-guide-booking.dto";

export interface IMarkServiceCompleteUsecase {
  execute(
    bookingId: string,
    travellerId: string,
    notes?: string,
    rating?: number
  ): Promise<LocalGuideBookingDto>;
}















