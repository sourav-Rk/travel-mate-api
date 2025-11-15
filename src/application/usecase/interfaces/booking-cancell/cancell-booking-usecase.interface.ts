import { BOOKINGSTATUS } from "../../../../shared/constants";

export interface ICancellBookingUsecase {
  execute(
    userId : string,
    bookingId: string,
    cancellationReason: string
  ): Promise<{
    success: boolean;
    refundAmount: number;
    status: BOOKINGSTATUS;
  }>;
}
