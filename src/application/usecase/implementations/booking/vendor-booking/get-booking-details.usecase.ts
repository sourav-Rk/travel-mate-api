import { inject, injectable } from "tsyringe";

import { NotFoundError } from "../../../../../domain/errors/notFoundError";
import { ValidationError } from "../../../../../domain/errors/validationError";
import { IBookingRepository } from "../../../../../domain/repositoryInterfaces/booking/booking-repository.interface";
import { ERROR_MESSAGE } from "../../../../../shared/constants";
import {
  BookingDetailsWithUserDetailsDto,
  BookingListWithUserDetailsDto,
} from "../../../../dto/response/bookingDto";
import { BookingMapper } from "../../../../mapper/booking.mapper";
import { IGetBookingDetailsVendorUsecase } from "../../../interfaces/booking/vendor-bookings/get-booking-details-usecase.interface";

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
