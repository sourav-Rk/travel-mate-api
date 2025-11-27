export interface VendorRevenueTrendPoint {
  date: string;
  revenue: number;
  adminCommission: number;
  vendorShare: number;
}

export interface VendorProfitVsCommissionBar {
  tripId: string;
  tripName: string;
  vendorShare: number;
  adminCommission: number;
}

export interface VendorPaymentModeDistributionItem {
  mode: string;
  amount: number;
}

export interface VendorBookingStatusDistribution {
  [status: string]: number;
}

export interface VendorRecentBookingRow {
  bookingId: string;
  travelerName: string;
  tripName: string;
  amount: number;
  date: string;
  status: string;
}

export interface VendorDashboardStatsDto {
  totalBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  totalRevenue: number; 
  totalVendorRevenue: number;
  totalRefundedAmount: number;
  totalPackages: number;
  totalTravellers: number;
  revenueTrend: VendorRevenueTrendPoint[];
  revenueBreakdownByPackage: Array<{ packageId: string; packageName: string; revenue: number }>;
  profitVsCommissionByTrip: VendorProfitVsCommissionBar[];
  paymentModeDistribution: VendorPaymentModeDistributionItem[];

  bookingStatusDistribution: VendorBookingStatusDistribution;
  recentBookings: VendorRecentBookingRow[];
}


























