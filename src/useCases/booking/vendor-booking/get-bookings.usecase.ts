import { inject, injectable } from "tsyringe";
import { IGetBookingsVendorUsecase } from "../../../entities/useCaseInterfaces/booking/vendor-bookings/get-bookings-usecase.interface";
import { IBookingRepository } from "../../../entities/repositoryInterfaces/booking/booking-repository.interface";
import { ValidationError } from "../../../shared/utils/error/validationError";
import { BOOKINGSTATUS, ERROR_MESSAGE } from "../../../shared/constants";
import { IVendorRepository } from "../../../entities/repositoryInterfaces/vendor/vendor-repository.interface";
import { IPackageRepository } from "../../../entities/repositoryInterfaces/package/package-repository.interface";
import { NotFoundError } from "../../../shared/utils/error/notFoundError";
import { BookingMapper } from "../../../interfaceAdapters/mappers/booking.mapper";
import { PaginatedBookingListWithUserDetailsVendorDto } from "../../../shared/dto/bookingDto";

@injectable()
export class GetBookingsUsecaseVendor implements IGetBookingsVendorUsecase {
  constructor(
    @inject("IBookingRepository")
    private _bookingRepository: IBookingRepository,

    @inject("IVendorRepository")
    private _vendorRepository: IVendorRepository,

    @inject("IPackageRepository")
    private _packageRepository: IPackageRepository
  ) {}

  async execute(
    vendorId: string,
    packageId: string,
    searchTerm: string,
    status: BOOKINGSTATUS,
    pageNumber: number,
    pageSize: number
  ): Promise<PaginatedBookingListWithUserDetailsVendorDto> {
    if (!vendorId || !packageId) {
      throw new ValidationError(ERROR_MESSAGE.ID_REQUIRED);
    }

    const vendor = await this._vendorRepository.findById(vendorId);
    if (!vendor) {
      throw new NotFoundError(ERROR_MESSAGE.USER_NOT_FOUND);
    }

    const packageExists = await this._packageRepository.findByPackageId(packageId);
    if (!packageExists) {
      throw new NotFoundError(ERROR_MESSAGE.PACKAGE_NOT_FOUND);
    }

    const validPageNumber = Math.max(1, pageNumber || 0);
    const validPageSize = Math.max(1, pageSize || 10);

    const { bookings, total } =
      await this._bookingRepository.findByPackageIdWithUserDetails(
        packageId,
        searchTerm,
        status,
        validPageNumber,
        validPageSize
      );

      

    const mappedData = bookings.map((doc) =>
      BookingMapper.mapToVendorBookingListDto(doc)
    );

    const totalPages = Math.ceil(total / validPageSize);

    return { bookings: mappedData, total : totalPages,minTravelersCount : packageExists.minGroupSize  };
  }
}
