import { inject, injectable } from "tsyringe";
import { IGetClientBookingDetailsUsecase } from "../../../entities/useCaseInterfaces/booking/client-booking/get-booking-details-client-usecase.interface";
import { BookingDetailsDto } from "../../../shared/dto/bookingDto";
import { ValidationError } from "../../../shared/utils/error/validationError";
import { ERROR_MESSAGE } from "../../../shared/constants";
import { IClientRepository } from "../../../entities/repositoryInterfaces/client/client.repository.interface";
import { NotFoundError } from "../../../shared/utils/error/notFoundError";
import { IBookingRepository } from "../../../entities/repositoryInterfaces/booking/booking-repository.interface";
import { BookingMapper } from "../../../interfaceAdapters/mappers/booking.mapper";

@injectable()
export class GetClientBookingDetailsUsecase
  implements IGetClientBookingDetailsUsecase
{
  constructor(
    @inject("IClientRepository")
    private _clientRepository: IClientRepository,

    @inject("IBookingRepository")
    private _bookingRepository: IBookingRepository
  ) {}

  async execute(userId: string, bookingId: string): Promise<BookingDetailsDto> {
    if (!userId || !bookingId) {
      throw new ValidationError(ERROR_MESSAGE.ID_REQUIRED);
    }

    const user = await this._clientRepository.findById(userId);

    if (!user) {
      throw new NotFoundError(ERROR_MESSAGE.USER_NOT_FOUND);
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
