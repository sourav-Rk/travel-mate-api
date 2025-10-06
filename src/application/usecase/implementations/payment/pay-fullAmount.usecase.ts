import { inject, injectable } from "tsyringe";
import { IPayFullAmountUsecase } from "../../interfaces/payment/pay-fullAmount-usecase.interface";
import { IPaymentService } from "../../../../domain/service-interfaces/payment-service.interface";
import { ValidationError } from "../../../../domain/errors/validationError";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../../../shared/constants";
import { IBookingRepository } from "../../../../domain/repositoryInterfaces/booking/booking-repository.interface";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { CustomError } from "../../../../domain/errors/customError";
import { IPackageRepository } from "../../../../domain/repositoryInterfaces/package/package-repository.interface";
import { config } from "../../../../shared/config";

@injectable()
export class PayFullAmountUsecase implements IPayFullAmountUsecase {
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
    if (!bookingId || !amount) {
      throw new ValidationError(ERROR_MESSAGE.ID_REQUIRED);
    }

    const booking = await this._bookingRepository.findByBookingId(bookingId);
    if (!booking) {
      throw new NotFoundError(ERROR_MESSAGE.BOOKING_NOT_FOUND);
    }

    //CHECK IF ALREADY PAID
    if (booking.fullPayment?.paid) {
      throw new CustomError(
        HTTP_STATUS.BAD_REQUEST,
        ERROR_MESSAGE.ALREADY_PAID_FULL_AMOUNT
      );
    }

    //check the due date for full payment
    if (booking.fullPayment?.dueDate) {
      const todayDate = new Date();
      if (todayDate > booking.fullPayment.dueDate) {
        throw new ValidationError(ERROR_MESSAGE.DUE_DATE_FOR_FULL_PAYMENT_END);
      }
    }

    const packageId = String(booking.packageId);
    const packageDetails = await this._packageRepository.findByPackageId(
      packageId
    );

    const fullAmount = booking.fullPayment?.amount;

    if (fullAmount !== booking.fullPayment?.amount) {
      throw new ValidationError(ERROR_MESSAGE.CONFLICT_IN_AMOUNT);
    }

    const currency = config.stripe.currency;
    const cancel_url = config.stripe.cancel_url;
    let success_url = `${config.client.uri}/pvt/bookings/${booking._id}/${packageId}`;

    //create the session
    const session = await this._paymentService.createCheckoutSession(
      amount,
      currency,
      success_url,
      cancel_url,
      {
        bookingId,
        type: "full_payment",
      },
      {
        name: packageDetails?.packageName ?? "Travel Package",
        description: `Remaining payment for the ${packageDetails?.packageName} trip`,
        images: packageDetails?.images,
      }
    );

    return session;
  }
}
