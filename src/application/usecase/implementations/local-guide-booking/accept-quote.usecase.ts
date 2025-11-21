import { inject, injectable } from "tsyringe";

import { CustomError } from "../../../../domain/errors/customError";
import { IGuideChatRoomRepository } from "../../../../domain/repositoryInterfaces/guide-chat/guide-chat-room-repository.interface";
import { IGuideMessageRepository } from "../../../../domain/repositoryInterfaces/guide-chat/guide-message-repository.interface";
import { ILocalGuideBookingRepository } from "../../../../domain/repositoryInterfaces/local-guide-booking/local-guide-booking-repository.interface";
import { ILocalGuideProfileRepository } from "../../../../domain/repositoryInterfaces/local-guide-profile/local-guide-profile-repository.interface";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../../../shared/constants";
import { AcceptQuoteDto } from "../../../dto/request/local-guide-booking.dto";
import type { QuoteMessagePayload } from "../../../dto/response/local-guide-booking.dto";
import { IAcceptQuoteUsecase } from "../../interfaces/local-guide-booking/accept-quote.interface";

@injectable()
export class AcceptQuoteUsecase implements IAcceptQuoteUsecase {
  constructor(
    @inject("IGuideMessageRepository")
    private readonly _guideMessageRepository: IGuideMessageRepository,
    @inject("IGuideChatRoomRepository")
    private readonly _guideChatRoomRepository: IGuideChatRoomRepository,
    @inject("ILocalGuideBookingRepository")
    private readonly _localGuideBookingRepository: ILocalGuideBookingRepository,
    @inject("ILocalGuideProfileRepository")
    private readonly _localGuideProfileRepository: ILocalGuideProfileRepository
  ) {}

  async execute(
    data: AcceptQuoteDto,
    travellerId: string
  ): Promise<void> {
    /**
     * Find quote message
     */
    const quoteMessage = await this._guideMessageRepository.findByQuoteId(
      data.quoteId
    );
    if (!quoteMessage || !quoteMessage.metadata) {
      throw new CustomError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_MESSAGE.QUOTE.QUOTE_NOT_FOUND
      );
    }

    const quotePayload = quoteMessage.metadata as QuoteMessagePayload;

    /**
     * Validate quote status
     */
    if (quotePayload.status !== "pending") {
      throw new CustomError(
        HTTP_STATUS.BAD_REQUEST,
        ERROR_MESSAGE.QUOTE.QUOTE_ALREADY_PROCESSED
      );
    }

    /**
     * Check if quote is expired
     */
    const expiresAt = new Date(quotePayload.expiresAt);
    if (expiresAt <= new Date()) {
      throw new CustomError(
        HTTP_STATUS.BAD_REQUEST,
        ERROR_MESSAGE.QUOTE.QUOTE_EXPIRED
      );
    }

    /**
     * Get chat room and validate traveller is participant
     */
    const room = await this._guideChatRoomRepository.findById(
      quoteMessage.guideChatRoomId
    );
    if (!room) {
      throw new CustomError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_MESSAGE.QUOTE.ROOM_NOT_FOUND
      );
    }

    const travellerParticipant = room.participants.find(
      (p) => p.userId === travellerId && p.role === "client"
    );
    if (!travellerParticipant) {
      throw new CustomError(
        HTTP_STATUS.FORBIDDEN,
        ERROR_MESSAGE.QUOTE.ONLY_TRAVELLER_CAN_ACCEPT
      );
    }

    /**
     * Get guide profile
     */
    const guideProfile = await this._localGuideProfileRepository.findByUserId(
      quoteMessage.senderId
    );
    if (!guideProfile) {
      throw new CustomError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_MESSAGE.QUOTE.GUIDE_PROFILE_NOT_FOUND
      );
    }

    /**
     * Check if booking already exists for this quote
     */
    const existingBooking =
      await this._localGuideBookingRepository.findByQuoteId(data.quoteId);
    if (existingBooking) {
      throw new CustomError(
        HTTP_STATUS.CONFLICT,
        ERROR_MESSAGE.QUOTE.BOOKING_ALREADY_EXISTS
      );
    }

    /**
     * Check for overlapping bookings
     */
    const sessionDate = new Date(quotePayload.sessionDate);
    const overlaps = await this._localGuideBookingRepository.checkOverlaps(
      quoteMessage.senderId,
      sessionDate,
      quotePayload.sessionTime,
      quotePayload.hours
    );

    if (overlaps.length > 0) {
      throw new CustomError(
        HTTP_STATUS.CONFLICT,
        ERROR_MESSAGE.QUOTE.OVERLAPPING_BOOKING
      );
    }

    /**
     * Calculate advance payment (30% of total)
     */
    const advanceAmount = Math.floor(quotePayload.totalAmount * 0.3);
    const fullAmount = quotePayload.totalAmount - advanceAmount;

    /**
     * Set advance payment due date
     *  Due date should be BEFORE the service date
     * - Default: 3 days from now
     * - But if service is within 4 days, set due date to 1 day before service
     * - This ensures advance payment is always due before the service starts
     */
    const now = new Date();
    const threeDaysFromNow = new Date(now);
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

    //
    /**
     *One day before service (at end of day before service)
     */
    const oneDayBeforeService = new Date(sessionDate);
    oneDayBeforeService.setDate(oneDayBeforeService.getDate() - 1);
    oneDayBeforeService.setHours(23, 59, 59, 999); // End of day before service

    /**
     *Use the earlier of: 3 days from now OR 1 day before service
     *This ensures advance payment is always due before service starts
     */
    let advanceDueDate =
      threeDaysFromNow < oneDayBeforeService
        ? threeDaysFromNow
        : oneDayBeforeService;

    /**
     *Ensure due date is not in the past
     */
    if (advanceDueDate < now) {
      /**
       *If service is today or very soon, set due date to end of today
       */
      advanceDueDate = new Date(now);
      advanceDueDate.setHours(23, 59, 59, 999);
    }

    /**
     * Create booking
     */
    const booking = await this._localGuideBookingRepository.create({
      travellerId,
      guideId: quoteMessage.senderId,
      guideProfileId: guideProfile._id!,
      quoteId: data.quoteId,
      guideChatRoomId: quoteMessage.guideChatRoomId,
      sessionDate,
      sessionTime: quotePayload.sessionTime,
      hours: quotePayload.hours,
      hourlyRate: quotePayload.hourlyRate,
      totalAmount: quotePayload.totalAmount,
      location: quotePayload.location,
      notes: quotePayload.notes,
      status: "QUOTE_ACCEPTED",
      advancePayment: {
        amount: advanceAmount,
        paid: false,
        dueDate: advanceDueDate,
        paidAt: null,
      },
      fullPayment: {
        amount: fullAmount,
        paid: false,
        dueDate: null,
        paidAt: null,
      },
    });

    /**
     * Update quote status to accepted
     */
    await this._guideMessageRepository.updateQuoteStatus(
      data.quoteId,
      "accepted"
    );

    /**
     * Update chat room context with booking ID
     */
    await this._guideChatRoomRepository.updateById(
      quoteMessage.guideChatRoomId,
      {
        latestContext: {
          ...room.latestContext,
          bookingId: booking.bookingId,
        },
      }
    );

  }
}
