import { BookingDetailsDto, ClientPackageBookingDto } from "../../../../shared/dto/bookingDto";


export interface IGetBookingDetailsVendorUsecase{
    execute(bookingId : string) : Promise<BookingDetailsDto | null>;
}