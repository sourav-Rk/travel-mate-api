export interface IPayLocalGuideAdvanceAmountUsecase {
  execute(
    userId:string,
    bookingId: string,
    amount: number
  ): Promise<{ url: string; sessionId: string }>;
}
















