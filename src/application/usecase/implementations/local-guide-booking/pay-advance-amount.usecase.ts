import { inject, injectable } from "tsyringe";

import { CustomError } from "../../../../domain/errors/customError";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ValidationError } from "../../../../domain/errors/validationError";
import { IClientRepository } from "../../../../domain/repositoryInterfaces/client/client.repository.interface";
import { ILocalGuideBookingRepository } from "../../../../domain/repositoryInterfaces/local-guide-booking/local-guide-booking-repository.interface";
import { ILocalGuideProfileRepository } from "../../../../domain/repositoryInterfaces/local-guide-profile/local-guide-profile-repository.interface";
import { IPaymentService } from "../../../../domain/service-interfaces/payment-service.interface";
import { config } from "../../../../shared/config";
import {
  ERROR_MESSAGE,
  HTTP_STATUS,
  LocalGuideBookingStatus,
} from "../../../../shared/constants";
import { IPayLocalGuideAdvanceAmountUsecase } from "../../interfaces/local-guide-booking/pay-advance-amount.interface";

@injectable()
export class PayLocalGuideAdvanceAmountUsecase
  implements IPayLocalGuideAdvanceAmountUsecase
{
  constructor(
    @inject("IPaymentService")
    private readonly _paymentService: IPaymentService,
    @inject("ILocalGuideBookingRepository")
    private readonly _localGuideBookingRepository: ILocalGuideBookingRepository,
    @inject("IClientRepository")
    private readonly _clientRepository: IClientRepository,
    @inject("ILocalGuideProfileRepository")
    private readonly _localGuideProfileRepository: ILocalGuideProfileRepository
  ) {}

  async execute(
    userId: string,
    bookingId: string,
    amount: number
  ): Promise<{ url: string; sessionId: string }> {
    if (!bookingId || !amount) {
      throw new ValidationError(ERROR_MESSAGE.ID_REQUIRED);
    }

    const booking = await this._localGuideBookingRepository.findByBookingId(
      bookingId
    );

    if (!booking) {
      throw new NotFoundError(
        ERROR_MESSAGE.LOCAL_GUIDE_BOOKING?.BOOKING_NOT_FOUND
      );
    }

    /**
     *check the user is the traveller
     */
    if (booking.travellerId !== userId) {
      throw new ValidationError(
        ERROR_MESSAGE.LOCAL_GUIDE_BOOKING.ONLY_TRAVELLER_CAN_PAY_THE_AMOUNT
      );
    }

    /**
     * Check if already paid
     */
    if (booking.advancePayment.paid) {
      throw new CustomError(
        HTTP_STATUS.BAD_REQUEST,
        ERROR_MESSAGE.LOCAL_GUIDE_BOOKING?.ALREADY_PAID_ADVANCE
      );
    }

    /**
     *Validate amount matches
     */
    if (booking.advancePayment.amount !== amount) {
      throw new ValidationError(
        ERROR_MESSAGE.LOCAL_GUIDE_BOOKING?.CONFLICT_IN_AMOUNT ||
          ERROR_MESSAGE.CONFLICT_IN_AMOUNT
      );
    }

    /**
     *Check the due date for advance payment
     */
    if (booking.advancePayment.dueDate) {
      const todayDate = new Date();
      if (todayDate > booking.advancePayment.dueDate) {
        throw new ValidationError(
          ERROR_MESSAGE.LOCAL_GUIDE_BOOKING?.DUE_DATE_FOR_ADVANCE_PAYMENT_END
        );
      }
    }

    /**
     *Validate booking status
     */
    const allowedStatuses: LocalGuideBookingStatus[] = [
      "QUOTE_ACCEPTED",
      "ADVANCE_PENDING",
    ];
    if (!allowedStatuses.includes(booking.status)) {
      throw new CustomError(
        HTTP_STATUS.BAD_REQUEST,
        ERROR_MESSAGE.LOCAL_GUIDE_BOOKING?.INVALID_BOOKING_STATUS
      );
    }

    /**
     *Get guide details for product info
     */
    const guide = await this._clientRepository.findById(booking.guideId);
    const guideName = guide
      ? `${guide.firstName || ""} ${guide.lastName || ""}`.trim() ||
        "Local Guide"
      : "Local Guide";
    let guideProfileImage;

    if (!guide?._id) {
      throw new ValidationError(ERROR_MESSAGE.ID_REQUIRED);
    }
    const guideDetails = await this._localGuideProfileRepository.findByUserId(
      guide?._id
    );
    if (guideDetails?.profileImage) {
      guideProfileImage = guideDetails.profileImage;
    }

    const currency = config.stripe.currency;
    const cancel_url = config.stripe.cancel_url;
    const success_url = `${config.client.uri}/pvt/local-guide/bookings/${bookingId}`;

    /**
     *Create the Stripe checkout session
     */
    const session = await this._paymentService.createCheckoutSession(
      amount,
      currency,
      success_url,
      cancel_url,
      {
        bookingId,
        type: "local_guide_advance",
      },
      {
        name: `Local Guide Service - ${guideName}`,
        description: `Advance payment (30%) for local guide service session on ${new Date(
          booking.sessionDate
        ).toLocaleDateString()} at ${booking.sessionTime}`,
        images: guideProfileImage
          ? [guideProfileImage]
          : guide?.profileImage
          ? [guide.profileImage]
          : undefined,
      }
    );

    return session;
  }
}




