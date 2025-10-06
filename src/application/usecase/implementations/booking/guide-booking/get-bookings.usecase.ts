import { inject, injectable } from "tsyringe";
import { IGetBookingsGuideUsecase } from "../../../interfaces/booking/guide-booking/get-bookings-usecase.interface";
import { IBookingRepository } from "../../../../../domain/repositoryInterfaces/booking/booking-repository.interface";
import { BOOKINGSTATUS, ERROR_MESSAGE } from "../../../../../shared/constants";
import { IGuideRepository } from "../../../../../domain/repositoryInterfaces/guide/guide-repository.interface";
import { ValidationError } from "../../../../../domain/errors/validationError";
import { NotFoundError } from "../../../../../domain/errors/notFoundError";
import { IPackageRepository } from "../../../../../domain/repositoryInterfaces/package/package-repository.interface";
import { PaginatedBookingListWithUserDetailsGuideDto } from "../../../../dto/response/bookingDto";
import { BookingMapper } from "../../../../mapper/booking.mapper";

@injectable()
export class GetBookingsGuideUsecase implements IGetBookingsGuideUsecase {
  constructor(
    @inject("IBookingRepository")
    private _bookingRepository: IBookingRepository,

    @inject("IGuideRepository")
    private _guideRepository: IGuideRepository,

    @inject("IPackageRepository")
    private _packageRepository: IPackageRepository
  ) {}

  async execute(
    guideId: string,
    packageId: string,
    searchTerm: string,
    status: BOOKINGSTATUS,
    pageNumber: number,
    pageSize: number
  ): Promise<PaginatedBookingListWithUserDetailsGuideDto> {
    if (!guideId || !packageId) {
      throw new ValidationError(ERROR_MESSAGE.ID_REQUIRED);
    }

    const guide = await this._guideRepository.findById(guideId);
    if (!guide) {
      throw new NotFoundError(ERROR_MESSAGE.GUIDE_NOT_FOUND);
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

    const totalPages = Math.ceil(total / validPageSize);

    const mappedBookings = bookings.map((doc) =>
      BookingMapper.mapToGuideBookingListDto(doc)
    );

    return { bookings: mappedBookings, total: totalPages };
  }
}
