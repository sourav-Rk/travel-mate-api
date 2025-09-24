import { BookingDetailsWithUserDetailsDto } from "../../../../shared/dto/bookingDto";


export interface IGetBookingDetailsGuideUsecase{
    execute(bookingId : string,guideId : string) : Promise<BookingDetailsWithUserDetailsDto | null>;
}