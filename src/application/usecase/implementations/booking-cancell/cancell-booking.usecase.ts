import { inject, injectable } from "tsyringe";
import { ICancellBookingUsecase } from "../../interfaces/booking-cancell/cancell-booking-usecase.interface";
import { IBookingRepository } from "../../../../domain/repositoryInterfaces/booking/booking-repository.interface";
import { ValidationError } from "../../../../domain/errors/validationError";
import {
  BOOKINGSTATUS,
  CANCELLATION_POLICIES,
  CANCELLATION_REFUND_POLICY,
  CancellationPolicy,
  ERROR_MESSAGE,
  HTTP_STATUS,
} from "../../../../shared/constants";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { IPackageRepository } from "../../../../domain/repositoryInterfaces/package/package-repository.interface";
import { CustomError } from "../../../../domain/errors/customError";
import { IBookingEntity } from "../../../../domain/entities/booking.entity";
import { IClientRepository } from "../../../../domain/repositoryInterfaces/client/client.repository.interface";

@injectable()
export class CancellBookingUsecase implements ICancellBookingUsecase {
  constructor(
    @inject("IBookingRepository")
    private _bookingRepository: IBookingRepository,

    @inject("IPackageRepository")
    private _packageRepository: IPackageRepository,

    @inject("IClientRepository")
    private _clientRepository: IClientRepository
  ) {}

  async execute(
    userId: string,
    bookingId: string,
    cancellationReason: string
  ): Promise<{
    success: boolean;
    refundAmount: number;
    status: BOOKINGSTATUS;
  }> {
    if (!bookingId || !userId) {
      throw new ValidationError(ERROR_MESSAGE.ID_REQUIRED);
    }

    if (!cancellationReason || cancellationReason.trim().length === 0) {
      throw new ValidationError("Cancellation reason is required");
    }

    const client = await this._clientRepository.findById(userId);

    if (!client) {
      throw new NotFoundError(ERROR_MESSAGE.USER_NOT_FOUND);
    }

    const booking = await this._bookingRepository.findByCustomBookingId(
      bookingId
    );

    if (!booking) {
      throw new NotFoundError(ERROR_MESSAGE.BOOKING_NOT_FOUND);
    }

    const packageDetails = await this._packageRepository.findByPackageId(
      booking.packageId
    );

    if (!packageDetails) {
      throw new NotFoundError(ERROR_MESSAGE.PACKAGE_NOT_FOUND);
    }
   

    console.log(booking.status,"-->booking status before cancell")

    // Check if cancellation is already requested
    if (booking.status === BOOKINGSTATUS.CANCELLATION_REQUESTED) {
      throw new CustomError(
        HTTP_STATUS.BAD_REQUEST,
        ERROR_MESSAGE.BOOKING_CANCELLATION.CANCELLATION_ALREADY_REQUESTED
      );
    }

    const tripStartDate = new Date(packageDetails.startDate);
    const todayDate = new Date();

    const diffTime = tripStartDate.getTime() - todayDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    console.log(diffDays,"day difference")

    // Check cancellation eligibility
    const { isEligible, policy } = this.checkCancellationEligibility(
      booking,
      diffDays
    );

    if (!isEligible) {
      throw new CustomError(
        HTTP_STATUS.BAD_REQUEST,
        ERROR_MESSAGE.BOOKING_CANCELLATION.CANCELLATION_NOT_ALLOWED
      );
    }

    // Calculate refund amount
    const refundAmount = this.calculateRefundAmount(booking, policy);

    // Update booking with cancellation request
    const updatedBooking = await this._bookingRepository.updateBooking(
      booking._id!,
      {
        status: BOOKINGSTATUS.CANCELLATION_REQUESTED,
        refundAmount,
        cancellationRequest: {
          requestedAt: new Date(),
          reason: cancellationReason,
          calculatedRefund: refundAmount,
        },
      }
    );

    console.log(updatedBooking)

    return {
      success: true,
      refundAmount,
      status: BOOKINGSTATUS.CANCELLATION_REQUESTED,
    };
  }

  private checkCancellationEligibility(
    booking: IBookingEntity,
    diffDays: number
  ): {
    isEligible: boolean;
    policy: CancellationPolicy;
  } {
    const nonCancellableStatuses = [
      BOOKINGSTATUS.COMPLETED,
      BOOKINGSTATUS.CANCELLED,
      BOOKINGSTATUS.EXPIRED,
      BOOKINGSTATUS.WAITLISTED,
      BOOKINGSTATUS.CANCELLATION_REQUESTED,
      BOOKINGSTATUS.APPLIED,
      BOOKINGSTATUS.ADVANCE_PENDING,
    ];

    // Check status eligibility
    if (nonCancellableStatuses.includes(booking.status)) {
      return {
        isEligible: false,
        policy:
          CANCELLATION_POLICIES[CANCELLATION_REFUND_POLICY.NON_REFUNDABLE],
      };
    }

    // Check time eligibility
    if (diffDays < 0) {
      return {
        isEligible: false,
        policy:
          CANCELLATION_POLICIES[CANCELLATION_REFUND_POLICY.NON_REFUNDABLE],
      };
    }

    let policy: CancellationPolicy;

    // Determine applicable policy
    if (booking.status === BOOKINGSTATUS.CONFIRMED) {
      policy =
        diffDays >= 10
          ? CANCELLATION_POLICIES[
              CANCELLATION_REFUND_POLICY.CONFIRMED_MORE_THAN_10_DAYS
            ]
          : CANCELLATION_POLICIES[
              CANCELLATION_REFUND_POLICY.CONFIRMED_LESS_THAN_10_DAYS
            ];
    } else if (booking.status === BOOKINGSTATUS.FULLY_PAID) {
      policy =
        diffDays >= 7
          ? CANCELLATION_POLICIES[
              CANCELLATION_REFUND_POLICY.FULLY_PAID_MORE_THAN_7_DAYS
            ]
          : CANCELLATION_POLICIES[
              CANCELLATION_REFUND_POLICY.FULLY_PAID_LESS_THAN_7_DAYS
            ];
    } else {
      return {
        isEligible: false,
        policy:
          CANCELLATION_POLICIES[CANCELLATION_REFUND_POLICY.NON_REFUNDABLE],
      };
    }


    console.log(policy,"-->policy")
    
    return { isEligible: true, policy };
  }

  private calculateRefundAmount(
    booking: IBookingEntity,
    policy: CancellationPolicy
  ): number {
    if (policy.id === CANCELLATION_REFUND_POLICY.NON_REFUNDABLE) {
      return 0;
    }

    if (booking.status === BOOKINGSTATUS.CONFIRMED) {
      const advanceAmount = booking.advancePayment?.amount || 0;
      console.log((advanceAmount * policy.advanceRefundPercentage) / 100)
      return (advanceAmount * policy.advanceRefundPercentage) / 100;
    } else if (booking.status === BOOKINGSTATUS.FULLY_PAID) {
      const totalPaid =
        (booking.advancePayment?.amount || 0) +
        (booking.fullPayment?.amount || 0);
        console.log((totalPaid * policy.refundPercentage) / 100)
      return (totalPaid * policy.refundPercentage) / 100;
    }

    return 0;
  }
}
