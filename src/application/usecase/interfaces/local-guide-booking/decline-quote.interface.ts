import { DeclineQuoteDto } from "../../../dto/request/local-guide-booking.dto";

export interface IDeclineQuoteUsecase {
  execute(data: DeclineQuoteDto, travellerId: string): Promise<void>;
}









