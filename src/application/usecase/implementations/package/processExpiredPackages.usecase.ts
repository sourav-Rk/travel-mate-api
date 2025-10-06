import { inject, injectable } from "tsyringe";
import { IProcessExpiredpackagesUsecase } from "../../interfaces/package/processExpiredPackages-usecase.interface";
import { IPackageRepository } from "../../../../domain/repositoryInterfaces/package/package-repository.interface";
import { IBookingRepository } from "../../../../domain/repositoryInterfaces/booking/booking-repository.interface";
import { BOOKINGSTATUS } from "../../../../shared/constants";
import { INotificationRepository } from "../../../../domain/repositoryInterfaces/notification/notification-repository.interface";

@injectable()
export class ProcessExpiredPackagesUsecase
  implements IProcessExpiredpackagesUsecase
{
  constructor(
    @inject("IPackageRepository")
    private _packageRepository: IPackageRepository,

    @inject("IBookingRepository")
    private _bookingRepository: IBookingRepository,

    @inject("INotificationRepository")
    private _notificationRepository: INotificationRepository
  ) {}

  async execute(): Promise<void> {
    console.log("process expired packages triggered");
    const today = new Date();

    const todayUTC = new Date(
      Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())
    );

    const packageExpiringToday =
      await this._packageRepository.findByPackagesApplicationDeadline(todayUTC);

    for (const pkg of packageExpiringToday) {
      const bookings = await this._bookingRepository.findByPackageId(
        pkg.packageId!
      );

      if (bookings.length >= pkg.minGroupSize) {
        if (pkg.status === "active") {
          pkg.status = "applications_closed";
          await this._packageRepository.updatePackageStatus(
            pkg._id!,
            "applications_closed"
          );
          console.log(pkg);
        }
      } else {
        for (const booking of bookings) {
          if (
            booking.status !== BOOKINGSTATUS.CANCELLED &&
            (booking.status === BOOKINGSTATUS.APPLIED ||
              booking.status === BOOKINGSTATUS.ADVANCE_PENDING)
          ) {
            booking.status = BOOKINGSTATUS.CANCELLED;
            await this._bookingRepository.updateBooking(booking._id!, booking);
            const message = `Your booking for ${pkg.packageName} has been cancelled because the minimum number of travelers was not met.`;
            const data = {
              userId: booking.userId,
              title: `Booking Cancelled for the trip ${pkg.packageName}`,
              message,
              type: "Booking",
              isRead: false,
            };
            await this._notificationRepository.createNotification(data);
          }
        }
        await this._packageRepository.updatePackageStatus(
          pkg._id!,
          "cancelled"
        );
      }
    }
  }
}
