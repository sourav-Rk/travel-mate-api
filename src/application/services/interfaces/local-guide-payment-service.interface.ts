export interface ILocalGuidePaymentService {
  processPayment(
    guideId: string,
    amount: number,
    bookingId: string,
    paymentType: "advance" | "full"
  ): Promise<void>;
}














