export interface IAdminPaymentService {
  processPayment(
    amount: number,
    bookingId: string,
    paymentType: "advance" | "full"
  ): Promise<void>;

  processCancellationRefund(
    refundAmount: number,
    bookingId: string,
    cancellationReason: string
  ): Promise<void>;
}
