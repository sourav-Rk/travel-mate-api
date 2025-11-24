import { inject, injectable } from "tsyringe";

import { CustomError } from "../../../../domain/errors/customError";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ValidationError } from "../../../../domain/errors/validationError";
import { IClientRepository } from "../../../../domain/repositoryInterfaces/client/client.repository.interface";
import { ILocalGuideBookingRepository } from "../../../../domain/repositoryInterfaces/local-guide-booking/local-guide-booking-repository.interface";
import { ILocalGuideProfileRepository } from "../../../../domain/repositoryInterfaces/local-guide-profile/local-guide-profile-repository.interface";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../../../shared/constants";
import { LocalGuideBookingDto } from "../../../dto/response/local-guide-booking.dto";
import { LocalGuideBookingMapper } from "../../../mapper/localGuideBooking.mapper";
import { IGetLocalGuideBookingDetailsUsecase } from "../../interfaces/local-guide-booking/get-booking-details.interface";

@injectable()
export class GetLocalGuideBookingDetailsUsecase
  implements IGetLocalGuideBookingDetailsUsecase
{
  constructor(
    @inject("ILocalGuideBookingRepository")
    private readonly _localGuideBookingRepository: ILocalGuideBookingRepository,
    @inject("IClientRepository")
    private readonly _clientRepository: IClientRepository,
    @inject("ILocalGuideProfileRepository")
    private readonly _localGuideProfileRepository: ILocalGuideProfileRepository
  ) {}

  async execute(bookingId: string, userId: string): Promise<LocalGuideBookingDto> {
    if (!bookingId || !userId) {
      throw new ValidationError(ERROR_MESSAGE.ID_REQUIRED);
    }

    // Fetch booking
    const booking = await this._localGuideBookingRepository.findByBookingId(bookingId);
    if (!booking) {
      throw new NotFoundError(ERROR_MESSAGE.LOCAL_GUIDE_BOOKING.BOOKING_NOT_FOUND);
    }

    // Verify user has access (either traveller or guide)
    const isTraveller = booking.travellerId === userId;
    const isGuide = booking.guideId === userId;

    if (!isTraveller && !isGuide) {
      throw new CustomError(
        HTTP_STATUS.FORBIDDEN,
        "You do not have permission to view this booking"
      );
    }

    // Enrich with guide/traveller profile information
    const dto = LocalGuideBookingMapper.toDto(booking);

    // Get guide profile info
    const guideProfile = await this._localGuideProfileRepository.findById(
      booking.guideProfileId
    );
    if (guideProfile) {
      const guide = await this._clientRepository.findById(booking.guideId);
      if (guide) {
        dto.guideName =
          `${guide.firstName || ""} ${guide.lastName || ""}`.trim() ||
          guide.firstName ||
          guide.lastName ||
          "Local Guide";
        dto.guideProfileImage = guide.profileImage || undefined;
      }
    }

    // Get traveller info
    const traveller = await this._clientRepository.findById(booking.travellerId);
    if (traveller) {
      dto.travellerName =
        `${traveller.firstName || ""} ${traveller.lastName || ""}`.trim() ||
        traveller.firstName ||
        traveller.lastName ||
        "Traveller";
      dto.travellerProfileImage = traveller.profileImage || undefined;
    }

    return dto;
  }
}











