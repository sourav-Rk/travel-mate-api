import { inject, injectable } from "tsyringe";

import { DeclineQuoteDto } from "../../../dto/request/local-guide-booking.dto";
import { IDeclineQuoteUsecase } from "../../interfaces/local-guide-booking/decline-quote.interface";
import { IGuideMessageRepository } from "../../../../domain/repositoryInterfaces/guide-chat/guide-message-repository.interface";
import { IGuideChatRoomRepository } from "../../../../domain/repositoryInterfaces/guide-chat/guide-chat-room-repository.interface";
import { CustomError } from "../../../../domain/errors/customError";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../../../shared/constants";
import type { QuoteMessagePayload } from "../../../dto/response/local-guide-booking.dto";

@injectable()
export class DeclineQuoteUsecase implements IDeclineQuoteUsecase {
  constructor(
    @inject("IGuideMessageRepository")
    private readonly _guideMessageRepository: IGuideMessageRepository,
    @inject("IGuideChatRoomRepository")
    private readonly _guideChatRoomRepository: IGuideChatRoomRepository
  ) {}

  async execute(data: DeclineQuoteDto, travellerId: string): Promise<void> {
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

    const quotePayload = quoteMessage.metadata;

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
        ERROR_MESSAGE.QUOTE.ONLY_TRAVELLER_CAN_DECLINE
      );
    }

    /**
     * Update quote status to declined
     */
    await this._guideMessageRepository.updateQuoteStatus(
      data.quoteId,
      "declined"
    );
  }
}






