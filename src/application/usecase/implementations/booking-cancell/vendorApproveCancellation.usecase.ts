import { inject, injectable } from "tsyringe";

import { IBookingEntity } from "../../../../domain/entities/booking.entity";
import { CustomError } from "../../../../domain/errors/customError";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ValidationError } from "../../../../domain/errors/validationError";
import { IBookingRepository } from "../../../../domain/repositoryInterfaces/booking/booking-repository.interface";
import { IVendorRepository } from "../../../../domain/repositoryInterfaces/vendor/vendor-repository.interface";
import { IWalletRepository } from "../../../../domain/repositoryInterfaces/wallet/wallet-repository.interface";
import { IWalletTransactionsRepository } from "../../../../domain/repositoryInterfaces/wallet/wallet-transactions-repository.interface";
import { IRealTimeNotificationService } from "../../../../domain/service-interfaces/real-time-notification-service.interface";
import {
  BOOKINGSTATUS,
  ERROR_MESSAGE,
  HTTP_STATUS,
  NOTIFICATION_TYPE,
  NOTIFICATIONS,
  TRANSACTION_DESCRIPTIONS,
  TRANSACTION_TYPE,
} from "../../../../shared/constants";
import { IAdminPaymentService } from "../../../services/interfaces/admin-payment-service.interface";
import { IVendorPaymentService } from "../../../services/interfaces/vendor-payment-service.interface";
import { IVendorApproveCancellationUsecase } from "../../interfaces/booking-cancell/vendor-approve-cancellation.-usecase.interface";

@injectable()
export class VendorApproveCancellationUsecase
  implements IVendorApproveCancellationUsecase
{
  constructor(
    @inject("IBookingRepository")
    private _bookingRepository: IBookingRepository,

    @inject("IWalletRepository")
    private _walletRepository: IWalletRepository,

    @inject("IWalletTransactionsRepository")
    private _walletTransactionsRepository: IWalletTransactionsRepository,

    @inject("IAdminPaymentService")
    private _adminPaymentService: IAdminPaymentService,

    @inject("IVendorPaymentService")
    private _vendorPaymentService: IVendorPaymentService,

    @inject("IVendorRepository")
    private _vendorRepository: IVendorRepository,

    @inject("IRealTimeNotificationService")
    private _realTimeNotificationService: IRealTimeNotificationService
  ) {}

  async execute(vendorId: string, bookingId: string): Promise<void> {
    if (!bookingId || !vendorId) {
      throw new ValidationError(ERROR_MESSAGE.ID_REQUIRED);
    }

    const vendor = await this._vendorRepository.findById(vendorId);

    if (!vendor) {
      throw new NotFoundError(ERROR_MESSAGE.USER_NOT_FOUND);
    }

    const booking = await this._bookingRepository.findByCustomBookingId(
      bookingId
    );

    if (!booking) {
      throw new NotFoundError(ERROR_MESSAGE.BOOKING_NOT_FOUND);
    }

    if (booking.status !== BOOKINGSTATUS.CANCELLATION_REQUESTED) {
      throw new CustomError(
        HTTP_STATUS.BAD_REQUEST,
        ERROR_MESSAGE.BOOKING_CANCELLATION.NO_CANCELLATION_REQUEST
      );
    }
    if (!booking.cancellationRequest) {
      throw new CustomError(
        HTTP_STATUS.BAD_REQUEST,
        ERROR_MESSAGE.BOOKING_CANCELLATION.INVALID_CANCELLATION_DATA
      );
    }

    const updateData: Partial<IBookingEntity> = {
      status: BOOKINGSTATUS.CANCELLED,
      cancelledAt: new Date(),
      cancellationRequest: {
        requestedAt: booking.cancellationRequest.requestedAt,
        reason: booking.cancellationRequest.reason,
        calculatedRefund: booking.cancellationRequest.calculatedRefund,
        approvedAt: new Date(),
      },
      refundAmount: booking.refundAmount,
    };

     await this._bookingRepository.updateBooking(
      booking._id!,
      updateData
    );

    const userWallet = await this._walletRepository.findByUserId(
      booking.userId
    );

    if (!userWallet) {
      throw new NotFoundError(ERROR_MESSAGE.WALLET_NOT_FOUND);
    }
    await this._walletRepository.updateById(userWallet._id, {
      balance:
        userWallet.balance + booking.cancellationRequest.calculatedRefund!,
    });

    await this._walletTransactionsRepository.save({
      walletId: userWallet._id,
      amount: booking.refundAmount,
      referenceId: booking.bookingId,
      type: TRANSACTION_TYPE.CREDIT,
      description: TRANSACTION_DESCRIPTIONS.REFUND_FOR_BOOKING_CANCELLATION(
        booking.bookingId
      ),
    });

    await this._adminPaymentService.processCancellationRefund(
      booking.refundAmount!,
      booking.bookingId,
      booking.cancellationRequest.reason
    );

    await this._vendorPaymentService.processCancellationRefund(
      vendorId!,
      booking.refundAmount!,
      booking.bookingId,
      booking.cancellationRequest.reason
    );

    await this._realTimeNotificationService.sendNotificationToUser(
      booking.userId,
      {
        message: NOTIFICATIONS.MESSAGES.NOTIFY_APPROVE_CANCELLATION_CLIENT(
          booking.refundAmount!,
          booking.bookingId,
          vendor.agencyName
        ),
        title: NOTIFICATIONS.TTILE.BOOKING_CANCELLATION_APPROVED,
        type: NOTIFICATION_TYPE.PAYMENT,
      }
    );
  }
}
