import { inject, injectable } from "tsyringe";
import { IHandleStripeWebHookUsecase } from "../../entities/useCaseInterfaces/payment/handleStripeWebhook-usecase.interface";
import Stripe from "stripe";
import { IBookingRepository } from "../../entities/repositoryInterfaces/booking/booking-repository.interface";
import { BOOKINGSTATUS } from "../../shared/constants";
import { IPaymentService } from "../../entities/serviceInterfaces/payment-service.interface";
import { IPackageRepository } from "../../entities/repositoryInterfaces/package/package-repository.interface";

@injectable()
export class HandleStripeWebHookUsecase implements IHandleStripeWebHookUsecase {
  constructor(
    @inject("IBookingRepository")
    private _bookingRepository: IBookingRepository,

    @inject("IPackageRepository")
    private _packageRepository: IPackageRepository,

    @inject("IPaymentService")
    private _paymentService: IPaymentService
  ) {}

  async execute(
    payload: Buffer,
    signature: string,
    endpointSecret: string
  ): Promise<void> {
    console.log("webhook triggered!");

    const event = await this._paymentService.verifyWebhookSignature(
      payload,
      signature,
      endpointSecret
    );

    switch (event.type) {
      case "checkout.session.completed": {
        console.log("checkout session completed ddddd");
        const session = event.data.object as Stripe.Checkout.Session;
        const bookingId = session.metadata?.bookingId;
        const type = session.metadata?.type;
        if (bookingId && type === "advance") {
          const booking = await this._bookingRepository.findByBookingId(
            bookingId
          );

          if (!booking) return;

          const packageDetails = await this._packageRepository.findByPackageId(
            String(booking.packageId)
          );

          //calculating deadline
          const startDate = new Date(packageDetails?.startDate!);
          const dueDate = new Date(startDate);
          const deadlineDays = packageDetails?.fullPaymentDeadlineDays ?? 7;
          dueDate.setDate(startDate.getDate() - deadlineDays);

          booking.fullPayment = {
            amount: Math.ceil(
              packageDetails?.price! - booking.advancePayment?.amount!
            ),
            paid: false,
            dueDate,
            paidAt: null,
          };

          booking.advancePayment = {
            ...booking.advancePayment!,
            paid: true,
            paidAt: new Date(),
          };

          await this._bookingRepository.updateBooking(bookingId, {
            status: BOOKINGSTATUS.CONFIRMED,
            advancePayment: booking.advancePayment,
            fullPayment: booking.fullPayment,
          });
        } else if (bookingId && type === "full_payment") {
          const booking = await this._bookingRepository.findByBookingId(
            bookingId
          );
          if (!booking) return;

          booking.fullPayment = {
            ...booking.fullPayment!,
            paid: true,
            paidAt: new Date(),
          };

          await this._bookingRepository.updateBooking(bookingId, {
            status: BOOKINGSTATUS.FULLY_PAID,
            fullPayment: booking.fullPayment,
          });
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
        break;
    }
  }
}
