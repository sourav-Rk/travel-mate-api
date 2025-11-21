import { inject, injectable } from "tsyringe";
import { v4 as uuidv4 } from "uuid";

import { CustomError } from "../../../../domain/errors/customError";
import { IGuideChatRoomRepository } from "../../../../domain/repositoryInterfaces/guide-chat/guide-chat-room-repository.interface";
import { ILocalGuideProfileRepository } from "../../../../domain/repositoryInterfaces/local-guide-profile/local-guide-profile-repository.interface";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../../../shared/constants";
import { GuideSendMessageDto } from "../../../dto/request/guide-chat.dto";
import { CreateQuoteDto } from "../../../dto/request/local-guide-booking.dto";
import {
  QuoteDto,
  QuoteMessagePayload,
} from "../../../dto/response/local-guide-booking.dto";
import { ISendGuideMessageUsecase } from "../../interfaces/guide-chat/send-guide-message.interface";
import { ICreateQuoteUsecase } from "../../interfaces/local-guide-booking/create-quote.interface";

@injectable()
export class CreateQuoteUsecase implements ICreateQuoteUsecase {
  constructor(
    @inject("IGuideChatRoomRepository")
    private readonly _guideChatRoomRepository: IGuideChatRoomRepository,
    @inject("ILocalGuideProfileRepository")
    private readonly _localGuideProfileRepository: ILocalGuideProfileRepository,
    @inject("ISendGuideMessageUsecase")
    private readonly _sendGuideMessageUsecase: ISendGuideMessageUsecase
  ) {}

  async execute(data: CreateQuoteDto, guideId: string): Promise<QuoteDto> {
    /**
     * Validate chat room exists and guide is a participant
     */
    const room = await this._guideChatRoomRepository.findById(
      data.guideChatRoomId
    );
    if (!room) {
      throw new CustomError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_MESSAGE.QUOTE.ROOM_NOT_FOUND
      );
    }

    /**
     * Verify guide is a participant with role "guide"
     */
    const guideParticipant = room.participants.find(
      (p) => p.userId === guideId && p.role === "guide"
    );
    if (!guideParticipant) {
      throw new CustomError(
        HTTP_STATUS.FORBIDDEN,
        ERROR_MESSAGE.QUOTE.ONLY_GUIDE_CAN_CREATE_QUOTE
      );
    }

    /**
     *Get guide profile to fetch hourly rate
     */
    const guideProfile =
      await this._localGuideProfileRepository.findByUserId(guideId);
    if (!guideProfile) {
      throw new CustomError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_MESSAGE.QUOTE.GUIDE_PROFILE_NOT_FOUND
      );
    }

    if (!guideProfile.hourlyRate || guideProfile.hourlyRate <= 0) {
      throw new CustomError(
        HTTP_STATUS.BAD_REQUEST,
        ERROR_MESSAGE.QUOTE.HOURLY_RATE_NOT_SET
      );
    }

  
    /**
     *Validate session date is in the future 
     * Ensure we're comparing UTC dates
     */
    const sessionDate = new Date(data.sessionDate);
    const now = new Date();
    // Compare in UTC to avoid timezone issues
    if (sessionDate.getTime() <= now.getTime()) {
      throw new CustomError(
        HTTP_STATUS.BAD_REQUEST,
        ERROR_MESSAGE.QUOTE.INVALID_SESSION_DATE
      );
    }

  
    /**
     *Validate hours
     */
    if (data.hours <= 0) {
      throw new CustomError(
        HTTP_STATUS.BAD_REQUEST,
        ERROR_MESSAGE.QUOTE.INVALID_HOURS
      );
    }

    /**
     *Calculate total amount 
     */
    const totalAmount = guideProfile.hourlyRate * data.hours;

 
    /**
     *Generate quote ID 
     */
    const quoteId = uuidv4();


    /**
     * Calculate expiration (48 hours from now) in UTC
     */
    const expiresAt = new Date();
    expiresAt.setUTCHours(expiresAt.getUTCHours() + 48);


    /**
     *Create quote payload 
     * Ensure all dates are stored in UTC ISO format
     */
    const quotePayload: QuoteMessagePayload = {
      quoteId,
      sessionDate: new Date(data.sessionDate).toISOString(), // Ensure UTC
      sessionTime: data.sessionTime, // Keep as HH:mm format
      hours: data.hours,
      hourlyRate: guideProfile.hourlyRate,
      totalAmount,
      location: data.location,
      notes: data.notes,
      status: "pending",
      expiresAt: expiresAt.toISOString(), // UTC ISO string
    };


    /**
     *  Send quote as a message
     */
    const messageDto: GuideSendMessageDto = {
      guideChatRoomId: data.guideChatRoomId,
      senderId: guideId,
      senderRole: "guide",
      messageType: "quote",
      message: `Quote for ${data.hours} hour(s) session on ${new Date(data.sessionDate).toLocaleDateString()} at ${data.sessionTime}`,
      metadata: quotePayload,
    };

    await this._sendGuideMessageUsecase.execute(messageDto);

    const quoteDto: QuoteDto = {
      quoteId,
      guideChatRoomId: data.guideChatRoomId,
      sessionDate: new Date(data.sessionDate).toISOString(),
      sessionTime: data.sessionTime, 
      hours: data.hours,
      hourlyRate: guideProfile.hourlyRate,
      totalAmount,
      location: data.location,
      notes: data.notes,
      status: "pending",
      expiresAt: expiresAt.toISOString(), 
      createdAt: new Date().toISOString(),
      createdBy: guideId,
    };

    return quoteDto;
  }
}

