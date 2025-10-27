import { inject, injectable } from "tsyringe";

import { CustomError } from "../../../../domain/errors/customError";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ValidationError } from "../../../../domain/errors/validationError";
import { IBookingRepository } from "../../../../domain/repositoryInterfaces/booking/booking-repository.interface";
import { IPackageRepository } from "../../../../domain/repositoryInterfaces/package/package-repository.interface";
import { IPaymentService } from "../../../../domain/service-interfaces/payment-service.interface";
import { config } from "../../../../shared/config";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../../../shared/constants";
import { IPayAdvanceAmountUsecase } from "../../interfaces/payment/pay-advance-amount-usecase.interface";

@injectable()
export class PayAdvanceAmountUsecase implements IPayAdvanceAmountUsecase {
  constructor(
    @inject("IPaymentService")
    private _paymentService: IPaymentService,

    @inject("IBookingRepository")
    private _bookingRepository: IBookingRepository,

    @inject("IPackageRepository")
    private _packageRepository: IPackageRepository
  ) {}

  async execute(
    bookingId: string,
    amount: number
  ): Promise<{ url: string; sessionId: string }> {
    const booking = await this._bookingRepository.findByBookingId(bookingId);

    if (!booking) {
      throw new NotFoundError(ERROR_MESSAGE.BOOKING_NOT_FOUND);
    }

    //check if already paid
    if (booking.advancePayment?.paid) {
      throw new CustomError(
        HTTP_STATUS.BAD_REQUEST,
        ERROR_MESSAGE.ALREADY_PAID_ADVANCE
      );
    }

    const packageId = String(booking.packageId);
    const packageDetails = await this._packageRepository.findByPackageId(
      packageId
    );

    const advanceAmount = booking.advancePayment?.amount;

    if (advanceAmount !== amount) {
      throw new ValidationError(ERROR_MESSAGE.CONFLICT_IN_AMOUNT);
    }

    //check the duedate for advance payment
    if (booking.advancePayment?.dueDate) {
      const todayDate = new Date();
      if (todayDate > booking.advancePayment.dueDate) {
        throw new ValidationError(
          ERROR_MESSAGE.DUE_DATE_FOR_ADVANCE_PAYMENT_END
        );
      }
    }

    const currency = config.stripe.currency;
    const cancel_url = config.stripe.cancel_url;
    const success_url = `${config.client.uri}/pvt/bookings/${bookingId}/${packageDetails?.packageId}`;

    //create the session
    const session = await this._paymentService.createCheckoutSession(
      amount,
      currency,
      success_url,
      cancel_url,
      {
        bookingId,
        type: "advance",
      },
      {
        name: packageDetails?.packageName ?? "Travel Package",
        description: `Advance Payment for the ${packageDetails?.packageName} Trip`,
        images: packageDetails?.images,
      }
    );
    return session;
  }
}
