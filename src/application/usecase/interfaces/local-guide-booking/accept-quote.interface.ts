import { AcceptQuoteDto } from "../../../dto/request/local-guide-booking.dto";

export interface IAcceptQuoteUsecase {
  execute(data: AcceptQuoteDto, travellerId: string): Promise<void>;
}
















