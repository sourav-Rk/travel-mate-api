import { inject, injectable } from "tsyringe";
import { IGetBookingsVendorUsecase } from "../../../interfaces/booking/vendor-bookings/get-bookings-usecase.interface";
import { IBookingRepository } from "../../../../../domain/repositoryInterfaces/booking/booking-repository.interface";
import { ValidationError } from "../../../../../domain/errors/validationError";
import { BOOKINGSTATUS, ERROR_MESSAGE } from "../../../../../shared/constants";
import { IVendorRepository } from "../../../../../domain/repositoryInterfaces/vendor/vendor-repository.interface";
import { IPackageRepository } from "../../../../../domain/repositoryInterfaces/package/package-repository.interface";
import { NotFoundError } from "../../../../../domain/errors/notFoundError";
import { BookingMapper } from "../../../../mapper/booking.mapper";
import { PaginatedBookingListWithUserDetailsVendorDto } from "../../../../dto/response/bookingDto";

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

    const packageExists = await this._packageRepository.findByPackageId(
      packageId
    );
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

    return {
      bookings: mappedData,
      total: totalPages,
      minTravelersCount: packageExists.minGroupSize,
    };
  }
}
