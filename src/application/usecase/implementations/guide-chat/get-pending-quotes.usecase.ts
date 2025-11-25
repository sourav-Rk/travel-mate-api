import { inject, injectable } from "tsyringe";

import { IClientRepository } from "../../../../domain/repositoryInterfaces/client/client.repository.interface";
import { IGuideChatRoomRepository } from "../../../../domain/repositoryInterfaces/guide-chat/guide-chat-room-repository.interface";
import { IGuideMessageRepository } from "../../../../domain/repositoryInterfaces/guide-chat/guide-message-repository.interface";
import { QuoteDto,type QuoteMessagePayload } from "../../../dto/response/local-guide-booking.dto";
import { IGetPendingQuotesUsecase } from "../../interfaces/guide-chat/get-pending-quotes.interface";

@injectable()
export class GetPendingQuotesUsecase implements IGetPendingQuotesUsecase {
  constructor(
    @inject("IGuideMessageRepository")
    private readonly _guideMessageRepository: IGuideMessageRepository,
    @inject("IGuideChatRoomRepository")
    private readonly _guideChatRoomRepository: IGuideChatRoomRepository,
    @inject("IClientRepository")
    private readonly _clientRepository: IClientRepository
  ) {}

  async execute(userId: string): Promise<QuoteDto[]> {
    /**
     * Get all pending quote messages for the user 
     */
    const quoteMessages = await this._guideMessageRepository.findQuotesByUserId(
      userId,
      "pending"
    );

    
    /**
     * Filter out expired quotes and enrich with room/participant info 
     */
    const quotes: QuoteDto[] = [];
    const now = new Date();

    for (const message of quoteMessages) {
      if (!message.metadata) continue;

      const quotePayload = message.metadata as QuoteMessagePayload;

      /**
       * Check if quote is expired 
       */
      const expiresAt = new Date(quotePayload.expiresAt);
      if (expiresAt <= now) {
        continue;
      }

      
      /**
       * Get room info 
       */
      const room = await this._guideChatRoomRepository.findById(
        message.guideChatRoomId
      );
      if (!room) continue;

      /**
       *The guide is the one who sent the quote (senderId) 
       */
      const guideId = message.senderId;

      /**
       *Verify guide is a participant in the room 
       */
      const guideParticipant = room.participants.find(
        (p) => p.userId === guideId && p.role === "guide"
      );

      if (!guideParticipant) continue;

      /**
       *Only return quotes where current user is the traveller (not the guide) 
       */
      const isTraveller = room.participants.some(
        (p) => p.userId === userId && p.role === "client"
      );
      
      if (!isTraveller) continue;

      /**
       *Get guide details for name 
       */
      let guideName = "Local Guide";
      let guideProfileImage: string | undefined;
      try {
        const guideClient = await this._clientRepository.findById(guideId);
        if (guideClient) {
          if (guideClient.firstName && guideClient.lastName) {
            guideName = `${guideClient.firstName} ${guideClient.lastName}`.trim();
          } else if (guideClient.firstName) {
            guideName = guideClient.firstName;
          }
          guideProfileImage = guideClient.profileImage;
        }
      } catch  {
    
      }

      /**
       *Enrich quote DTO with guide info 
       */
      const quoteDto: QuoteDto & { guideName?: string; guideProfileImage?: string } = {
        quoteId: quotePayload.quoteId,
        guideChatRoomId: message.guideChatRoomId,
        sessionDate: quotePayload.sessionDate,
        sessionTime: quotePayload.sessionTime,
        hours: quotePayload.hours,
        hourlyRate: quotePayload.hourlyRate,
        totalAmount: quotePayload.totalAmount,
        location: quotePayload.location,
        notes: quotePayload.notes,
        status: quotePayload.status,
        expiresAt: quotePayload.expiresAt,
        createdAt: message.createdAt?.toISOString() || new Date().toISOString(),
        createdBy: guideId,
        guideName,
        guideProfileImage,
      };

      quotes.push(quoteDto as QuoteDto);
    }

    /**
     *Sort by expiration (soonest first) 
     */
    return quotes.sort((a, b) => {
      const aExpires = new Date(a.expiresAt).getTime();
      const bExpires = new Date(b.expiresAt).getTime();
      return aExpires - bExpires;
    });
  }
}

