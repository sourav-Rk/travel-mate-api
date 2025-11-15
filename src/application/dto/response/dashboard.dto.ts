export interface RevenueTrendDataPoint {
  date: string;
  revenue: number;
  adminRevenue: number;
  agencyRevenue: number;
}

export interface RevenueDistribution {
  admin: number;
  agency: number;
}

export interface BookingStatusDistribution {
  applied: number;
  confirmed: number;
  fully_paid: number;
  completed: number;
  waitlisted: number;
  cancelled: number;
  expired: number;
  advance_pending: number;
  cancellation_requested: number;
}

export interface TopAgency {
  agencyId: string;
  agencyName: string;
  revenue: number;
  bookings: number;
}

export interface CategoryPerformance {
  category: string;
  revenue: number;
  bookings: number;
}

export interface DashboardStatsDto {
  totalSales: number;
  totalTravellers: number;
  totalAgencies: number;
  totalPackages: number;
  completedPackages: number;
  totalRevenue: number;
  adminRevenue: number;
  agencyRevenue: number;
  revenueTrend: RevenueTrendDataPoint[];
  revenueDistribution: RevenueDistribution;
  bookingStatusDistribution: BookingStatusDistribution;
  topAgencies: TopAgency[];
  categoryPerformance: CategoryPerformance[];
  topPackages: { packageId: string; packageName: string; revenue: number; bookings: number }[];
}
