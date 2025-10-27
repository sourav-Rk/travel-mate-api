import { inject, injectable } from "tsyringe";

import { NotFoundError } from "../../../../../domain/errors/notFoundError";
import { ValidationError } from "../../../../../domain/errors/validationError";
import { IBookingRepository } from "../../../../../domain/repositoryInterfaces/booking/booking-repository.interface";
import { IGuideRepository } from "../../../../../domain/repositoryInterfaces/guide/guide-repository.interface";
import { ERROR_MESSAGE } from "../../../../../shared/constants";
import {
  BookingDetailsWithUserDetailsDto,
  BookingListWithUserDetailsDto,
} from "../../../../dto/response/bookingDto";
import { BookingMapper } from "../../../../mapper/booking.mapper";
import { IGetBookingDetailsGuideUsecase } from "../../../interfaces/booking/guide-booking/get-booking-details-guide-usecase.interface";

@injectable()
export class GetBookingDetailsGuideUsecase
  implements IGetBookingDetailsGuideUsecase
{
  constructor(
    @inject("IBookingRepository")
    private _bookingRepository: IBookingRepository,

    @inject("IGuideRepository")
    private _guideRepository: IGuideRepository
  ) {}

  async execute(
    bookingId: string,
    guideId: string
  ): Promise<BookingDetailsWithUserDetailsDto | null> {
    if (!bookingId || !guideId) {
      throw new ValidationError(ERROR_MESSAGE.ID_REQUIRED);
    }

    const guide = await this._guideRepository.findById(guideId);

    if (!guide) {
      throw new NotFoundError(ERROR_MESSAGE.GUIDE_NOT_FOUND);
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
