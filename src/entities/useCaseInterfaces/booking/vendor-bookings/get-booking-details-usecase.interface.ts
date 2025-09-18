import { BookingDetailsWithUserDetailsDto } from "../../../../shared/dto/bookingDto";


export interface IGetBookingDetailsVendorUsecase{
    execute(bookingId : string) : Promise<BookingDetailsWithUserDetailsDto | null>;
}