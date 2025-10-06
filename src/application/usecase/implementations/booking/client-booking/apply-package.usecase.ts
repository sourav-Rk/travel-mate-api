import { inject, injectable } from "tsyringe";
import { IApplyPackageUsecase } from "../../../interfaces/booking/client-booking/apply-package-usecase.interface";
import { IPackageRepository } from "../../../../../domain/repositoryInterfaces/package/package-repository.interface";
import {
  ISuccessResponseHandler,
  successResponseHandler,
} from "../../../../../shared/utils/successResponseHandler";
import { ValidationError } from "../../../../../domain/errors/validationError";
import {
  BOOKINGSTATUS,
  ERROR_MESSAGE,
  HTTP_STATUS,
  SUCCESS_MESSAGE,
} from "../../../../../shared/constants";
import { IBookingRepository } from "../../../../../domain/repositoryInterfaces/booking/booking-repository.interface";
import { IClientRepository } from "../../../../../domain/repositoryInterfaces/client/client.repository.interface";
import { NotFoundError } from "../../../../../domain/errors/notFoundError";
import { CustomError } from "../../../../../domain/errors/customError";
import { INotificationRepository } from "../../../../../domain/repositoryInterfaces/notification/notification-repository.interface";
import { IPushNotificationService } from "../../../../../domain/service-interfaces/push-notifications.interface";
import { IWishListRepository } from "../../../../../domain/repositoryInterfaces/wishlist/wishlist-repository.interface";
import { bookingDB } from "../../../../../infrastructure/database/models/booking.model";

@injectable()
export class ApplyPackageUsecase implements IApplyPackageUsecase {
  constructor(
    @inject("IPackageRepository")
    private _packageRepository: IPackageRepository,

    @inject("IBookingRepository")
    private _bookingRepository: IBookingRepository,

    @inject("IClientRepository")
    private _clientRepository: IClientRepository,

    @inject("IWishListRepository")
    private _wishlistRepository: IWishListRepository,

    @inject("INotificationRepository")
    private _notificationRepository: INotificationRepository,

    @inject("IPushNotificationService")
    private _pushNotificationService: IPushNotificationService
  ) {}

  async execute(
    userId: string,
    packageId: string
  ): Promise<ISuccessResponseHandler> {
    //validation
    if (!userId || !packageId) {
      throw new ValidationError(ERROR_MESSAGE.ID_REQUIRED);
    }

    //user existence
    const existingUser = await this._clientRepository.findById(userId);
    if (!existingUser) {
      throw new NotFoundError(ERROR_MESSAGE.USER_NOT_FOUND);
    }

    //package existence
    const existingPackage = await this._packageRepository.findByPackageId(
      packageId
    );
    if (!existingPackage) {
      throw new NotFoundError(ERROR_MESSAGE.PACKAGE_NOT_FOUND);
    }

    console.log(existingPackage, "1 --existingpackage");

    //checking status of the package
    if (existingPackage.status !== "active") {
      throw new ValidationError(
        `${ERROR_MESSAGE.TRIP_STATUS} ${existingPackage.status}`
      );
    }

    //blocked or not
    if (existingPackage.isBlocked) {
      throw new CustomError(
        HTTP_STATUS.FORBIDDEN,
        ERROR_MESSAGE.PACKAGE_BLOCKED
      );
    }

    //checking deadline
    if (existingPackage.applicationDeadline) {
      const todayDate = new Date();
      if (todayDate > existingPackage.applicationDeadline) {
        throw new ValidationError(ERROR_MESSAGE.DATE_FOR_THE_BOOKING_ENDED);
      }
    }

    //duplicate application check
    const existingForThisPackage =
      await this._bookingRepository.findByPackageIdAndUserId(userId, packageId);
    if (existingForThisPackage) {
      throw new ValidationError(ERROR_MESSAGE.ALREADY_APPLIED_PACKAGE);
    }

    console.log(existingForThisPackage, "2 -> existing for this package");

    //checking conflicting trips
    const userActiveBookings =
      await this._bookingRepository.getAllConfirmedBookingsByUserIdWithPackageDetails(
        userId,
        "applied"
      );

    console.log(userActiveBookings, "3-->acitive bookings");
    if (userActiveBookings?.length > 0) {
      for (const booking of userActiveBookings) {
        const pkg: any = booking.packageId;
        if (!pkg?.startDate || !pkg.endDate) continue;

        const overlap =
          existingPackage.startDate <= pkg.endDate &&
          existingPackage.endDate >= pkg.startDate;

        if (overlap) {
          throw new CustomError(
            HTTP_STATUS.CONFLICT,
            ERROR_MESSAGE.CONFLICTING_TRIP
          );
        }
      }
    }

    //checks if package is full
    const seatOccupyingStatuses: BOOKINGSTATUS[] = [
      BOOKINGSTATUS.APPLIED,
      BOOKINGSTATUS.ADVANCE_PENDING,
      BOOKINGSTATUS.CONFIRMED,
    ];
    const activeCount = await this._bookingRepository.countByPackageIdAndStatus(
      packageId,
      seatOccupyingStatuses
    );

    console.log(activeCount, "4 --> active count");

    let statusToCreate = BOOKINGSTATUS.APPLIED;
    let isWaitlisted = false;

    if (activeCount >= existingPackage.maxGroupSize) {
      statusToCreate = BOOKINGSTATUS.WAITLISTED;
      isWaitlisted = true;
    } else if (existingPackage.paymentAlertSentAt) {
      statusToCreate = BOOKINGSTATUS.ADVANCE_PENDING;
    }

    //create the booking
    const booking = await this._bookingRepository.createBooking({
      userId,
      packageId,
      status: statusToCreate,
      isWaitlisted,
    });

    //remove from wishlist if it is already present
    const wishlist = await this._wishlistRepository.findByUserId(userId);

    if (wishlist) {
      console.log(wishlist, "-->wishlist");
      const packageExistingInWishlist = wishlist.packages.find(
        (id) => id.toString() === packageId
      );
      console.log(packageExistingInWishlist, "5-->wisling");
      if (packageExistingInWishlist) {
        await this._wishlistRepository.removeFromWishlist(userId, packageId);
      }
    }

    //notification
    const appliedCount =
      await this._bookingRepository.countByPackageIdAndStatus(packageId, [
        BOOKINGSTATUS.APPLIED,
        BOOKINGSTATUS.ADVANCE_PENDING,
        BOOKINGSTATUS.CONFIRMED,
      ]);
    if (
      appliedCount >= existingPackage.minGroupSize &&
      !existingPackage.paymentAlertSentAt
    ) {
      console.log("minimum reached");
      const vendor = existingPackage.agencyId;
      const message = `Minimum number of people (${existingPackage.minGroupSize}) have applied for ${existingPackage.packageName}.`;

      const data = {
        userId: vendor,
        title: "Minimum no of people reached",
        message,
        type: "Booking",
        isRead: false,
      };
      await this._notificationRepository.createNotification(data);
      await this._pushNotificationService.sendNotification(
        vendor,
        data.title,
        data.message
      );
    }

    let successMessage = SUCCESS_MESSAGE.BOOKING_APPLIED;
    if (statusToCreate === BOOKINGSTATUS.ADVANCE_PENDING) {
      successMessage = SUCCESS_MESSAGE.BOOKING_ADVANCE_PENDING;
    } else if (statusToCreate === BOOKINGSTATUS.WAITLISTED) {
      successMessage = SUCCESS_MESSAGE.BOOKING_WAITLISTED;
    }

    return successResponseHandler(true, HTTP_STATUS.CREATED, successMessage);
  }
}
