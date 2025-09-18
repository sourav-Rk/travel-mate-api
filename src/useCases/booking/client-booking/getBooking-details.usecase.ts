import { inject, injectable } from "tsyringe";
import { IBookingRepository } from "../../../entities/repositoryInterfaces/booking/booking-repository.interface";
import { ValidationError } from "../../../shared/utils/error/validationError";
import { ERROR_MESSAGE } from "../../../shared/constants";
import { IClientRepository } from "../../../entities/repositoryInterfaces/client/client.repository.interface";
import { NotFoundError } from "../../../shared/utils/error/notFoundError";
import { IPackageRepository } from "../../../entities/repositoryInterfaces/package/package-repository.interface";
import { BookingMapper } from "../../../interfaceAdapters/mappers/booking.mapper";
import { ClientPackageBookingDto } from "../../../shared/dto/bookingDto";
import { IGetBookingDetailsClientUsecase } from "../../../entities/useCaseInterfaces/booking/client-booking/get-booking-details-user-usecase.interface";

@injectable()
export class GetBookingDetailsUsecase implements IGetBookingDetailsClientUsecase {
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
    const packageExist = await this._packageRepository.findByPackageId(packageId);
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
