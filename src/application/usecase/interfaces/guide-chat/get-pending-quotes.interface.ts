import { QuoteDto } from "../../../dto/response/local-guide-booking.dto";

export interface IGetPendingQuotesUsecase {
  execute(userId: string): Promise<QuoteDto[]>;
}







