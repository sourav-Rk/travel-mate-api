import Stripe from "stripe";
import { inject, injectable } from "tsyringe";

import { IBookingRepository } from "../../../../domain/repositoryInterfaces/booking/booking-repository.interface";
import { ILocalGuideBookingRepository } from "../../../../domain/repositoryInterfaces/local-guide-booking/local-guide-booking-repository.interface";
import { IPackageRepository } from "../../../../domain/repositoryInterfaces/package/package-repository.interface";
import { IPaymentService } from "../../../../domain/service-interfaces/payment-service.interface";
import { IRevenueDistributionService } from "../../../services/interfaces/revenue-distribution-service.interface";
import { ILocalGuidePaymentService } from "../../../services/interfaces/local-guide-payment-service.interface";
import { BOOKINGSTATUS, LocalGuideBookingStatus } from "../../../../shared/constants";
import { IGroupChatService } from "../../../services/interfaces/group-chat-service.interface";
import { IHandleStripeWebHookUsecase } from "../../interfaces/payment/handleStripeWebhook-usecase.interface";
import { IUpdateLocalGuideStatsUsecase } from "../../interfaces/badge/update-stats.interface";

@injectable()
export class HandleStripeWebHookUsecase implements IHandleStripeWebHookUsecase {
  constructor(
    @inject("IBookingRepository")
    private _bookingRepository: IBookingRepository,

    @inject("IPackageRepository")
    private _packageRepository: IPackageRepository,

    @inject("IPaymentService")
    private _paymentService: IPaymentService,

    @inject("IRevenueDistributionService")
    private _revenueDistributionService: IRevenueDistributionService,

    @inject("IGroupChatService")
    private _groupChatService: IGroupChatService,

    @inject("ILocalGuideBookingRepository")
    private _localGuideBookingRepository: ILocalGuideBookingRepository,

    @inject("ILocalGuidePaymentService")
    private _localGuidePaymentService: ILocalGuidePaymentService,

    @inject("IUpdateLocalGuideStatsUsecase")
    private _updateLocalGuideStatsUsecase: IUpdateLocalGuideStatsUsecase
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

          await this._revenueDistributionService.execute(
            booking.bookingId,
            booking.advancePayment.amount,
            "advance"
          );
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

          await this._revenueDistributionService.execute(
            booking.bookingId,
            booking.fullPayment.amount,
            "full"
          );

          await this._groupChatService.handle(
            booking.bookingId,
            booking.packageId
          );
        } else if (bookingId && type === "local_guide_advance") {
          // Handle local guide advance payment
          console.log("guide payment advance webhook triggered", bookingId, type);
          const localGuideBooking =
            await this._localGuideBookingRepository.findByBookingId(bookingId);

          console.log(localGuideBooking);

          if (!localGuideBooking) return;

          // Update advance payment status
          localGuideBooking.advancePayment = {
            ...localGuideBooking.advancePayment,
            paid: true,
            paidAt: new Date(),
          };

          // Update booking status to CONFIRMED
          await this._localGuideBookingRepository.updateByBookingId(bookingId, {
            status: "CONFIRMED" as LocalGuideBookingStatus,
            advancePayment: localGuideBooking.advancePayment,
          });

          // Credit guide's wallet
          await this._localGuidePaymentService.processPayment(
            localGuideBooking.guideId,
            localGuideBooking.advancePayment.amount,
            bookingId,
            "advance"
          );
        } else if (bookingId && type === "local_guide_full") {
          // Handle local guide full payment
          const localGuideBooking =
            await this._localGuideBookingRepository.findByBookingId(bookingId);

          if (!localGuideBooking) return;

          // Update full payment status
          localGuideBooking.fullPayment = {
            ...localGuideBooking.fullPayment,
            paid: true,
            paidAt: new Date(),
          };

          // Update booking status to FULLY_PAID
          await this._localGuideBookingRepository.updateByBookingId(bookingId, {
            status: "FULLY_PAID" as LocalGuideBookingStatus,
            fullPayment: localGuideBooking.fullPayment,
          });

          // Credit guide's wallet
          await this._localGuidePaymentService.processPayment(
            localGuideBooking.guideId,
            localGuideBooking.fullPayment.amount,
            bookingId,
            "full"
          );

          /**
           * Update guide stats and trigger badge evaluation
           */
          try {
            await this._updateLocalGuideStatsUsecase.execute(
              localGuideBooking.guideProfileId,
              { trigger: "service_completion" }
            );
          } catch (error) {
            // Log error but don't fail the payment processing
            console.error("Error updating guide stats for badge evaluation:", error);
          }
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
        break;
    }
  }
}
