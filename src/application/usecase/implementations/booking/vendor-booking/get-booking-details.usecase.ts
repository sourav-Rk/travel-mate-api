import { inject, injectable } from "tsyringe";
import { IGetBookingDetailsVendorUsecase } from "../../../interfaces/booking/vendor-bookings/get-booking-details-usecase.interface";
import { ValidationError } from "../../../../../domain/errors/validationError";
import { ERROR_MESSAGE } from "../../../../../shared/constants";
import { IBookingRepository } from "../../../../../domain/repositoryInterfaces/booking/booking-repository.interface";
import { BookingMapper } from "../../../../mapper/booking.mapper";
import { NotFoundError } from "../../../../../domain/errors/notFoundError";
import {
  BookingDetailsWithUserDetailsDto,
  BookingListWithUserDetailsDto,
} from "../../../../dto/response/bookingDto";

@injectable()
export class GetBookingDetailsVendorUsecase
  implements IGetBookingDetailsVendorUsecase
{
  constructor(
    @inject("IBookingRepository")
    private _bookingRepository: IBookingRepository
  ) {}

  async execute(
    bookingId: string
  ): Promise<BookingDetailsWithUserDetailsDto | null> {
    if (!bookingId) {
      throw new ValidationError(ERROR_MESSAGE.ID_REQUIRED);
    }

    const bookingDetails =
      await this._bookingRepository.findByBookingIdWithUserDetails(bookingId);

    if (!bookingDetails) {
      throw new NotFoundError(ERROR_MESSAGE.BOOKING_NOT_FOUND);
    }

    return BookingMapper.mapToBookingDetailsWithUserDetailsDto(
      bookingDetails as BookingListWithUserDetailsDto
    );
  }
}
