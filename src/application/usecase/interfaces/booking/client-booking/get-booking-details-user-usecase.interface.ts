import { ClientPackageBookingDto } from "../../../../dto/response/bookingDto";

export interface IGetBookingDetailsClientUsecase {
  execute(userId: string, packageId: string): Promise<ClientPackageBookingDto>;
}
