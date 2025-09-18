import { inject, injectable } from "tsyringe";
import { IPayAdvanceAmountUsecase } from "../../entities/useCaseInterfaces/payment/pay-advance-amount-usecase.interface";
import { IPaymentService } from "../../entities/serviceInterfaces/payment-service.interface";
import { IBookingRepository } from "../../entities/repositoryInterfaces/booking/booking-repository.interface";
import { NotFoundError } from "../../shared/utils/error/notFoundError";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../shared/constants";
import { config } from "../../shared/config";
import { ValidationError } from "../../shared/utils/error/validationError";
import { IPackageRepository } from "../../entities/repositoryInterfaces/package/package-repository.interface";
import { CustomError } from "../../shared/utils/error/customError";

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
    const packageDetails = await this._packageRepository.findByPackageId(packageId);

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
    let success_url = `${config.client.uri}/pvt/bookings/${bookingId}/${packageDetails?.packageId}`;

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
