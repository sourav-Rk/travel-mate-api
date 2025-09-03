import { BookingDetailsDto } from "../../../../shared/dto/bookingDto";

export interface IGetClientBookingDetailsUsecase {
    execute(userId : string,bookingId : string) : Promise<BookingDetailsDto>;
}