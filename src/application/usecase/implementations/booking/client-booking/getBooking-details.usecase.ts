import { inject, injectable } from "tsyringe";
import { IBookingRepository } from "../../../../../domain/repositoryInterfaces/booking/booking-repository.interface";
import { ValidationError } from "../../../../../domain/errors/validationError";
import { ERROR_MESSAGE } from "../../../../../shared/constants";
import { IClientRepository } from "../../../../../domain/repositoryInterfaces/client/client.repository.interface";
import { NotFoundError } from "../../../../../domain/errors/notFoundError";
import { IPackageRepository } from "../../../../../domain/repositoryInterfaces/package/package-repository.interface";
import { BookingMapper } from "../../../../mapper/booking.mapper";
import { ClientPackageBookingDto } from "../../../../dto/response/bookingDto";
import { IGetBookingDetailsClientUsecase } from "../../../interfaces/booking/client-booking/get-booking-details-user-usecase.interface";

@injectable()
export class GetBookingDetailsUsecase
  implements IGetBookingDetailsClientUsecase
{
  constructor(
    @inject("IBookingRepository")
    private _bookingRepository: IBookingRepository,

    @inject("IClientRepository")
    private _clientRepository: IClientRepository,

    @inject("IPackageRepository")
    private _packageRepository: IPackageRepository
  ) {}

  async execute(
    userId: string,
    packageId: string
  ): Promise<ClientPackageBookingDto> {
    //basic validation
    if (!userId || !packageId) {
      throw new ValidationError(ERROR_MESSAGE.ID_REQUIRED);
    }

    //check user exists
    const user = await this._clientRepository.findById(userId);
    if (!user) {
      throw new NotFoundError(ERROR_MESSAGE.USER_NOT_FOUND);
    }

    //check package exist
    const packageExist = await this._packageRepository.findByPackageId(
      packageId
    );
    if (!packageExist) {
      throw new NotFoundError(ERROR_MESSAGE.PACKAGE_NOT_FOUND);
    }

    //check if any booking recored
    const booking = await this._bookingRepository.findByPackageIdAndUserId(
      userId,
      packageId
    );
    if (!booking) {
      throw new NotFoundError(ERROR_MESSAGE.BOOKING_NOT_FOUND);
    }

    return BookingMapper.mapToClientPackageBookingDto(booking);
  }
}
