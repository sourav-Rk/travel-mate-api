import { inject, injectable } from "tsyringe";

import { ILocalGuideBookingRepository } from "../../../../domain/repositoryInterfaces/local-guide-booking/local-guide-booking-repository.interface";
import { IGetBookingByChatRoomUsecase } from "../../interfaces/local-guide-booking/get-booking-by-chat-room.interface";
import { LocalGuideBookingDto } from "../../../dto/response/local-guide-booking.dto";
import { LocalGuideBookingMapper } from "../../../mapper/localGuideBooking.mapper";

@injectable()
export class GetBookingByChatRoomUsecase
  implements IGetBookingByChatRoomUsecase
{
  constructor(
    @inject("ILocalGuideBookingRepository")
    private readonly _localGuideBookingRepository: ILocalGuideBookingRepository
  ) {}

  async execute(guideChatRoomId: string): Promise<LocalGuideBookingDto | null> {
    const booking =
      await this._localGuideBookingRepository.findByGuideChatRoomId(
        guideChatRoomId
      );

    if (!booking) {
      return null;
    }

    return LocalGuideBookingMapper.toDto(booking);
  }
}







