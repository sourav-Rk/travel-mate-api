import { LocalGuideBookingDto } from "../../../dto/response/local-guide-booking.dto";

export interface IGetBookingByChatRoomUsecase {
  execute(guideChatRoomId: string): Promise<LocalGuideBookingDto | null>;
}














