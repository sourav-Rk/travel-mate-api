import { inject, injectable } from "tsyringe";

import { CustomError } from "../../../../domain/errors/customError";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ValidationError } from "../../../../domain/errors/validationError";
import { IClientRepository } from "../../../../domain/repositoryInterfaces/client/client.repository.interface";
import { ILocalGuideBookingRepository } from "../../../../domain/repositoryInterfaces/local-guide-booking/local-guide-booking-repository.interface";
import { ERROR_MESSAGE, HTTP_STATUS, LocalGuideBookingStatus } from "../../../../shared/constants";
import { LocalGuideBookingDto } from "../../../dto/response/local-guide-booking.dto";
import { LocalGuideBookingMapper } from "../../../mapper/localGuideBooking.mapper";
import { IUpdateLocalGuideStatsUsecase } from "../../interfaces/badge/update-stats.interface";
import { IMarkServiceCompleteUsecase } from "../../interfaces/local-guide-booking/mark-service-complete.interface";

@injectable()
export class MarkServiceCompleteUsecase implements IMarkServiceCompleteUsecase {
  constructor(
    @inject("ILocalGuideBookingRepository")
    private readonly _localGuideBookingRepository: ILocalGuideBookingRepository,
    @inject("IClientRepository")
    private readonly _clientRepository: IClientRepository,
    @inject("IUpdateLocalGuideStatsUsecase")
    private readonly _updateLocalGuideStatsUsecase: IUpdateLocalGuideStatsUsecase
  ) {}

  async execute(
    bookingId: string,
    travellerId: string,
    notes?: string,
    rating?: number
  ): Promise<LocalGuideBookingDto> {
    if (!bookingId || !travellerId) {
      throw new ValidationError(ERROR_MESSAGE.ID_REQUIRED);
    }

    /**
     *Validate rating if provided 
     */
    if (rating !== undefined && (rating < 1 || rating > 5)) {
      throw new ValidationError(ERROR_MESSAGE.RATING_ERROR);
    }

    /**
     * Fetch booking 
     */
    const booking = await this._localGuideBookingRepository.findByBookingId(bookingId);
    if (!booking) {
      throw new NotFoundError(ERROR_MESSAGE.LOCAL_GUIDE_BOOKING.BOOKING_NOT_FOUND);
    }

   
    /**
     *Verify traveller is the owner of this booking 
     */
    if (booking.travellerId !== travellerId) {
      throw new CustomError(
        HTTP_STATUS.FORBIDDEN,
        ERROR_MESSAGE.LOCAL_GUIDE_BOOKING.ONLY_TRAVELLER_CAN_COMPLETE
      )
    }

    
    /**
     * Validate booking status 
     */
    const allowedStatuses: LocalGuideBookingStatus[] = ["CONFIRMED", "IN_PROGRESS"];
    if (!allowedStatuses.includes(booking.status)) {
      throw new CustomError(
        HTTP_STATUS.BAD_REQUEST,
        ERROR_MESSAGE.LOCAL_GUIDE_BOOKING.SERVICE_ALREADY_COMPLETED
      );
    }


    /**
     *Validate advance payment is paid 
     */
    if (!booking.advancePayment.paid) {
      throw new CustomError(
        HTTP_STATUS.BAD_REQUEST,
        ERROR_MESSAGE.LOCAL_GUIDE_BOOKING.ADVANCE_PAYMENT_REQUIRED
      );
    }

    /**
     *Check if already completed 
     */
    if (booking.status === "COMPLETED" || booking.status === "FULLY_PAID") {
      throw new CustomError(
        HTTP_STATUS.BAD_REQUEST,
        ERROR_MESSAGE.LOCAL_GUIDE_BOOKING.SERVICE_ALREADY_COMPLETED
      );
    }

    /**
     * Update booking 
     */
    const now = new Date();
    const updatedBooking = await this._localGuideBookingRepository.updateByBookingId(bookingId, {
      status: "COMPLETED" as LocalGuideBookingStatus,
      serviceCompletedAt: now,
      completionNotes: notes,
      completionRating: rating,
      fullPayment: {
        ...booking.fullPayment,
        dueDate: now,
      },
    });

    if (!updatedBooking) {
      throw new NotFoundError(ERROR_MESSAGE.LOCAL_GUIDE_BOOKING.BOOKING_NOT_FOUND);
    }

    /**
     * Update guide stats and trigger badge evaluation
     */
    try {
      await this._updateLocalGuideStatsUsecase.execute(
        updatedBooking.guideProfileId,
        { trigger: "service_completion" }
      );
    } catch (error) {
      console.error("Error updating guide stats for badge evaluation:", error);
    }

    return LocalGuideBookingMapper.toDto(updatedBooking);
  }
}



