export interface VendorSalesReportSummaryDto {
  totalRevenue: number;
  totalVendorRevenue: number;
  totalAdminCommission: number;
  totalRefundAmount: number;
  totalBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  refundedBookings: number;
  totalTravellers: number;
  totalPackages: number;
}

export interface VendorSalesReportRevenueBreakdownDto {
  packageId: string;
  packageName: string;
  totalBookings: number;
  totalRevenue: number;
  vendorShare: number;
  adminCommission: number;
  totalRefunds: number;
  travellersCount: number;
}

export interface VendorSalesReportRevenueTrendDto {
  date: string;
  totalRevenue: number;
  vendorShare: number;
  adminCommission: number;
}

export interface VendorSalesReportProfitVsCommissionDto {
  tripId: string;
  tripName: string;
  vendorShare: number;
  adminCommission: number;
}

export interface VendorSalesReportLatestBookingDto {
  bookingId: string;
  tripName: string;
  travelerName: string;
  amount: number;
  date: string;
  status: string;
}

export interface VendorSalesReportDto {
  summary: VendorSalesReportSummaryDto;
  revenueBreakdown: VendorSalesReportRevenueBreakdownDto[];
  revenueTrend: VendorSalesReportRevenueTrendDto[];
  profitVsCommission: VendorSalesReportProfitVsCommissionDto[];
  latestBookings: VendorSalesReportLatestBookingDto[];
}














