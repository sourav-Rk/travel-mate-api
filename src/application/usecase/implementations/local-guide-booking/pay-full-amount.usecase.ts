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
import { IPayLocalGuideFullAmountUsecase } from "../../interfaces/local-guide-booking/pay-full-amount.interface";

@injectable()
export class PayLocalGuideFullAmountUsecase
  implements IPayLocalGuideFullAmountUsecase
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
     * check whether the user is the travller
     */
    if (booking.travellerId !== userId) {
      throw new NotFoundError(
        ERROR_MESSAGE.LOCAL_GUIDE_BOOKING.ONLY_TRAVELLER_CAN_PAY_THE_AMOUNT
      );
    }

    /**
     *Check if already paid
     */
    if (booking.fullPayment.paid) {
      throw new CustomError(
        HTTP_STATUS.BAD_REQUEST,
        ERROR_MESSAGE.LOCAL_GUIDE_BOOKING?.ALREADY_PAID_FULL
      );
    }

    /**
     *Validate amount matches
     */
    if (booking.fullPayment.amount !== amount) {
      throw new ValidationError(
        ERROR_MESSAGE.LOCAL_GUIDE_BOOKING?.CONFLICT_IN_AMOUNT ||
          ERROR_MESSAGE.CONFLICT_IN_AMOUNT
      );
    }

    /**
     *Check the due date for full payment (if set)
     */
    if (booking.fullPayment.dueDate) {
      const todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0);

      const due = new Date(booking.fullPayment.dueDate);
      due.setHours(0, 0, 0, 0);
      if (todayDate > due) {
        throw new ValidationError(
          ERROR_MESSAGE.LOCAL_GUIDE_BOOKING?.DUE_DATE_FOR_FULL_PAYMENT_END
        );
      }
    }

    /**
     *Validate booking status - full payment only after service completion
     */
    const allowedStatuses: LocalGuideBookingStatus[] = ["COMPLETED"];
    if (!allowedStatuses.includes(booking.status)) {
      throw new CustomError(
        HTTP_STATUS.BAD_REQUEST,
        ERROR_MESSAGE.LOCAL_GUIDE_BOOKING?.SERVICE_NOT_COMPLETED
      );
    }

    /**
     *Ensure advance payment is paid
     */
    if (!booking.advancePayment.paid) {
      throw new CustomError(
        HTTP_STATUS.BAD_REQUEST,
        ERROR_MESSAGE.LOCAL_GUIDE_BOOKING?.ADVANCE_NOT_PAID
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

    if(!guide?._id){
      throw new ValidationError(ERROR_MESSAGE.ID_REQUIRED)
    }

    const guideDetails = await this._localGuideProfileRepository.findByUserId(
      guide?._id
    );
    let guideProfileImage;
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
        type: "local_guide_full",
      },
      {
        name: `Local Guide Service - ${guideName}`,
        description: `Full payment (remaining 70%) for local guide service session on ${new Date(
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











