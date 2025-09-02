import { inject, injectable } from "tsyringe";
import { IGetBookingDetailsVendorUsecase } from "../../../entities/useCaseInterfaces/booking/vendor-bookings/get-booking-details-usecase.interface";
import { ValidationError } from "../../../shared/utils/error/validationError";
import { ERROR_MESSAGE } from "../../../shared/constants";
import { IBookingRepository } from "../../../entities/repositoryInterfaces/booking/booking-repository.interface";
import { BookingDetailsDto } from "../../../shared/dto/bookingDto";
import { BookingMapper } from "../../../interfaceAdapters/mappers/booking.mapper";
import { NotFoundError } from "../../../shared/utils/error/notFoundError";

@injectable()
export class GetBookingDetailsVendorUsecase
  implements IGetBookingDetailsVendorUsecase
{
  constructor(
    @inject("IBookingRepository")
    private _bookingRepository: IBookingRepository
  ) {}

  async execute(bookingId: string): Promise<BookingDetailsDto | null> {
    if (!bookingId) {
      throw new ValidationError(ERROR_MESSAGE.ID_REQUIRED);
    }

    const bookingDetails = await this._bookingRepository.findByBookingId(
      bookingId
    );

    if (!bookingDetails) {
      throw new NotFoundError(ERROR_MESSAGE.BOOKING_NOT_FOUND);
    }

    return BookingMapper.mapToBookingDetailsDto(bookingDetails);
  }
}
