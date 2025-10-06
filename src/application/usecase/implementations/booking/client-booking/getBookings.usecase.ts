import { inject, injectable } from "tsyringe";
import { IGetBookingsUsecase } from "../../../interfaces/booking/client-booking/getBookings-usecase.interface";
import { IBookingRepository } from "../../../../../domain/repositoryInterfaces/booking/booking-repository.interface";
import { BOOKINGSTATUS, ERROR_MESSAGE } from "../../../../../shared/constants";
import { ValidationError } from "../../../../../domain/errors/validationError";
import { IClientRepository } from "../../../../../domain/repositoryInterfaces/client/client.repository.interface";
import { NotFoundError } from "../../../../../domain/errors/notFoundError";
import {
  BookingListDTO,
  BookingListWithPackageDetailsDto,
} from "../../../../dto/response/bookingDto";
import { BookingMapper } from "../../../../mapper/booking.mapper";

@injectable()
export class GetBookingsUsecase implements IGetBookingsUsecase {
  constructor(
    @inject("IBookingRepository")
    private _bookingRepository: IBookingRepository,

    @inject("IClientRepository")
    private _clientRepository: IClientRepository
  ) {}

  async execute(
    userId: string,
    statuses: BOOKINGSTATUS[]
  ): Promise<BookingListDTO[]> {
    if (!userId) {
      throw new ValidationError(ERROR_MESSAGE.ID_REQUIRED);
    }

    const user = await this._clientRepository.findById(userId);

    if (!user) {
      throw new NotFoundError(ERROR_MESSAGE.USER_NOT_FOUND);
    }

    const bookings = await this._bookingRepository.getBookingsByUserIdAndStatus(
      userId,
      statuses
    );

    return bookings.map((doc) =>
      BookingMapper.mapToBookingListWithPackageDetail(doc)
    );
  }
}
