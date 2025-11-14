export interface SalesReportSummaryDto {
  totalRevenue: number;
  adminRevenue: number;
  vendorRevenue: number;
  totalBookings: number;
  confirmedBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalTravellers: number;
  totalVendors: number;
  totalPackages: number;
  totalRefunds: number;
  avgBookingValue: number;
  conversionRate: number;
}

export interface VendorRevenueBreakdownDto {
  vendorId: string;
  vendorName: string;
  totalRevenue: number;
  vendorShare: number;
  adminCommission: number;
  totalBookings: number;
  refundsIssued: number;
}

export interface PackageRevenueBreakdownDto {
  packageId: string;
  packageName: string;
  vendorName: string;
  totalRevenue: number;
  adminCommission: number;
  vendorShare: number;
  totalBookings: number;
  refunds: number;
}

export interface RevenueTrendDataPointDto {
  date: string;
  totalRevenue: number;
  adminRevenue: number;
  vendorRevenue: number;
  totalBookings?: number;
}

export interface RecentTransactionDto {
  bookingId: string;
  packageName: string;
  vendorName: string;
  travelerName: string;
  amount: number;
  adminShare: number;
  vendorShare: number;
  bookingStatus: string;
  paymentMode: string;
  date: Date;
}

export interface ProfitVsCommissionDto {
  vendorId: string;
  vendorName: string;
  adminCommission: number;
  vendorEarnings: number;
  profitRatio: number;
}

export interface AdminSalesReportDto {
  summary: SalesReportSummaryDto;
  vendorBreakdown: VendorRevenueBreakdownDto[];
  packageBreakdown: PackageRevenueBreakdownDto[];
  revenueTrend: RevenueTrendDataPointDto[];
  recentTransactions: RecentTransactionDto[];
  profitVsCommission: ProfitVsCommissionDto[];
}






