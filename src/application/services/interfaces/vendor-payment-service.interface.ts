export interface IVendorPaymentService {
  processPayment(
    vendorId: string,
    amount: number,
    bookingId: string,
    paymentType: "advance" | "full"
  ): Promise<void>;

  processCancellationRefund(
    vendorId: string,
    refundAmount: number,
    bookingId: string,
    cancellationReason: string
  ): Promise<void>;
}
