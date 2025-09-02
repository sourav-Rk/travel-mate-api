import { BOOKINGSTATUS } from "../../../../shared/constants";
import { BookingListDTO } from "../../../../shared/dto/bookingDto";


export interface IGetBookingsUsecase{
    execute(userId : string,statuses : BOOKINGSTATUS[]) : Promise<BookingListDTO[]>;
}