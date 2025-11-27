import { CreateQuoteDto } from "../../../dto/request/local-guide-booking.dto";
import { QuoteDto } from "../../../dto/response/local-guide-booking.dto";

export interface ICreateQuoteUsecase {
  execute(data: CreateQuoteDto, guideId: string): Promise<QuoteDto>;
}















