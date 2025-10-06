import { inject, injectable } from "tsyringe";
import { IUpdatePackageStatusUsecaseGuide } from "../../interfaces/guideTrips/update-package-status-usecase.interface";
import { IGuideRepository } from "../../../../domain/repositoryInterfaces/guide/guide-repository.interface";
import { IPackageRepository } from "../../../../domain/repositoryInterfaces/package/package-repository.interface";
import {
  BOOKINGSTATUS,
  ERROR_MESSAGE,
  HTTP_STATUS,
  PackageStatus,
} from "../../../../shared/constants";
import { ValidationError } from "../../../../domain/errors/validationError";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { CustomError } from "../../../../domain/errors/customError";
import { IBookingRepository } from "../../../../domain/repositoryInterfaces/booking/booking-repository.interface";

@injectable()
export class UpdatePackageStatusUsecaseGuide
  implements IUpdatePackageStatusUsecaseGuide
{
  constructor(
    @inject("IGuideRepository")
    private _guideRepository: IGuideRepository,

    @inject("IPackageRepository")
    private _packageRepository: IPackageRepository,

    @inject("IBookingRepository")
    private _bookingRepository: IBookingRepository
  ) {}

  async execute(
    guideId: string,
    packageId: string,
    status: PackageStatus
  ): Promise<void> {
    if (!guideId || !packageId) {
      throw new ValidationError(ERROR_MESSAGE.ID_REQUIRED);
    }

    if (!status) {
      throw new ValidationError(ERROR_MESSAGE.STATUS_REQUIRED);
    }

    const guide = await this._guideRepository.findById(guideId);
    if (!guide) {
      throw new NotFoundError(ERROR_MESSAGE.GUIDE_NOT_FOUND);
    }

    const packageExist = await this._packageRepository.findByPackageId(
      packageId
    );
    if (!packageExist) {
      throw new NotFoundError(ERROR_MESSAGE.PACKAGE_NOT_FOUND);
    }

    if (packageExist.status === "completed") {
      throw new CustomError(
        HTTP_STATUS.BAD_REQUEST,
        ERROR_MESSAGE.TRIP_ALREADY_COMPLETED
      );
    }

    if (packageExist.status !== "ongoing") {
      throw new CustomError(
        HTTP_STATUS.BAD_REQUEST,
        ERROR_MESSAGE.STATUS_CANNOT_BE_UPDATED
      );
    }

    const todayDate = new Date();
    if (packageExist.endDate > todayDate) {
      throw new CustomError(
        HTTP_STATUS.BAD_REQUEST,
        ERROR_MESSAGE.CANNOT_CHANGE_STATUS
      );
    }

    const asyncTask: any[] = [];

    const bookings = await this._bookingRepository.findByPackageId(packageId);

    const updatePromises = bookings.map((booking) => {
      if (booking.status !== BOOKINGSTATUS.CANCELLED || !booking.isWaitlisted) {
        booking.status = BOOKINGSTATUS.COMPLETED;
        return this._bookingRepository.updateBooking(booking._id!, booking);
      }
      return null;
    });

    await Promise.all(updatePromises.filter((p) => p !== null));

    await this._packageRepository.update(packageExist._id, { status });
  }
}
