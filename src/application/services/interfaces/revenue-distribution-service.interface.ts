export interface IRevenueDistributionService {
  execute(
    bookingId: string,
    amount: number,
    paymentType: "advance" | "full"
  ): Promise<{ success: boolean; vendorAmount: number; adminAmount: number }>;
}
