import { inject, injectable } from "tsyringe";
import { IGetCancelledBookingDetailsUsecase } from "../../interfaces/booking-cancell/get-cancelled-bookingDetails-usecase.interface";
import { IBookingRepository } from "../../../../domain/repositoryInterfaces/booking/booking-repository.interface";
import { ValidationError } from "../../../../domain/errors/validationError";
import { ERROR_MESSAGE } from "../../../../shared/constants";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { BookingMapper } from "../../../mapper/booking.mapper";
import { CancelledBookingDetailsWithUserAndPackageDetailsDto } from "../../../dto/response/bookingDto";

@injectable()
export class GetCancelledBookingDetailsUsecase
  implements IGetCancelledBookingDetailsUsecase
{
  constructor(
    @inject("IBookingRepository")
    private _bookingRepository: IBookingRepository
  ) {}

  async execute(
    bookingId: string
  ): Promise<CancelledBookingDetailsWithUserAndPackageDetailsDto> {
    if (!bookingId) {
      throw new ValidationError(ERROR_MESSAGE.ID_REQUIRED);
    }

    const booking =
      await this._bookingRepository.findCancelledBookingIdWithUserDetails(
        bookingId
      );

    if (!booking) {
      throw new NotFoundError(ERROR_MESSAGE.BOOKING_NOT_FOUND);
    }

    return BookingMapper.mapToCancelledBookingWithUserAndPackageDetailsDto(
      booking
    );
  }
}
