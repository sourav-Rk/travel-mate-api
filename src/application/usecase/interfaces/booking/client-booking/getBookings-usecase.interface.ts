import { BOOKINGSTATUS } from "../../../../../shared/constants";
import { BookingListDTO } from "../../../../dto/response/bookingDto";

export interface IGetBookingsUsecase {
  execute(userId: string, statuses: BOOKINGSTATUS[]): Promise<BookingListDTO[]>;
}
