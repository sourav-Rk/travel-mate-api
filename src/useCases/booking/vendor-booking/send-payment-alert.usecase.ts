import { inject, injectable } from "tsyringe";
import { ISendPaymentAlertUsecase } from "../../../entities/useCaseInterfaces/booking/vendor-bookings/send-payment-alert-usecase.interface";
import { IVendorRepository } from "../../../entities/repositoryInterfaces/vendor/vendor-repository.interface";
import { ValidationError } from "../../../shared/utils/error/validationError";
import { BOOKINGSTATUS, ERROR_MESSAGE } from "../../../shared/constants";
import { NotFoundError } from "../../../shared/utils/error/notFoundError";
import { IPackageRepository } from "../../../entities/repositoryInterfaces/package/package-repository.interface";
import { IBookingRepository } from "../../../entities/repositoryInterfaces/booking/booking-repository.interface";
import { INotificationEntity } from "../../../entities/modelsEntity/notification.entity";
import { INotificationRepository } from "../../../entities/repositoryInterfaces/notification/notification-repository.interface";
import { IPushNotificationService } from "../../../entities/serviceInterfaces/push-notifications.interface";

@injectable()
export class SendPaymentAlertUsecase implements ISendPaymentAlertUsecase {
  constructor(
    @inject("IVendorRepository")
    private _vendorRepository: IVendorRepository,

    @inject("IPackageRepository")
    private _packageRepository: IPackageRepository,

    @inject("IBookingRepository")
    private _bookingRepository: IBookingRepository,

    @inject("INotificationRepository")
    private _notificationRepository: INotificationRepository,

    @inject("IPushNotificationService")
    private _pushNotificationService: IPushNotificationService
  ) {}

  async execute(vendorId: string, packageId: string): Promise<void> {
    if (!vendorId || !packageId) {
      throw new ValidationError(ERROR_MESSAGE.ID_REQUIRED);
    }

    //vendor existence
    const vendor = await this._vendorRepository.findById(vendorId);

    if (!vendor) {
      throw new NotFoundError(ERROR_MESSAGE.USER_NOT_FOUND);
    }

    //package existence
    const packageExist = await this._packageRepository.findByPackageId(packageId);
    if (!packageExist) {
      throw new NotFoundError(ERROR_MESSAGE.PACKAGE_NOT_FOUND);
    }

    //calculating advance amount
    const advanceAmount = Math.floor(packageExist.price * 0.3);
    const dueDate = new Date();
    const deadlineDays = packageExist.advancePaymentDeadlineDays ?? 5;
    dueDate.setDate(dueDate.getDate() + deadlineDays);

    //fetch bookings
    const bookings = await this._bookingRepository.findByPackageId(packageId);

    for (const booking of bookings) {
      if (booking.status === BOOKINGSTATUS.APPLIED) {
        //update booking status to advance pending
        booking.status = BOOKINGSTATUS.ADVANCE_PENDING;
        booking.advancePayment = {
          amount: advanceAmount,
          paid: false,
          dueDate,
          paidAt: null,
        };
        await this._bookingRepository.updateBooking(String(booking._id), booking);

        const notification: INotificationEntity = {
          userId: booking.userId,
          title: "Advance Payment Required",
          message: `Please pay 30% (${advanceAmount}) for your ${
            packageExist.packageName
          } booking. Due by ${dueDate.toDateString()}`,
          isRead: false,
          type: "PAYMENT",
          createdAt: new Date(),
        };
        await this._notificationRepository.createNotification(notification);

        await this._pushNotificationService.sendNotification(
          booking.userId,
          notification.title,
          notification.message
        );
      }
    }
    await this._packageRepository.update(packageExist._id, {
      paymentAlertSentAt: new Date(),
    });
  }
}
