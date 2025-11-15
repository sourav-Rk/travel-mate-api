import { CancelledBookingDetailsWithUserAndPackageDetailsDto } from "../../../dto/response/bookingDto";

export interface IGetCancelledBookingDetailsUsecase {
  execute(bookingId: string): Promise<CancelledBookingDetailsWithUserAndPackageDetailsDto>;
}
