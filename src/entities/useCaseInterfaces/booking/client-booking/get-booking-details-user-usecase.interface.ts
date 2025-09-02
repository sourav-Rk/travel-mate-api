import { ClientPackageBookingDto } from "../../../../shared/dto/bookingDto";

export interface IGetBookingDetailsClientUsecase {
   execute(userId : string,packageId : string) : Promise<ClientPackageBookingDto>;
}