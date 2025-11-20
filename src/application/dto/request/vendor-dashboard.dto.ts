export type VENDOR_DASHBOARD_PERIOD = "daily" | "weekly" | "monthly" | "yearly";

export class GetVendorDashboardStatsReqDTO {
  period?: VENDOR_DASHBOARD_PERIOD;
  startDate?: string;
  endDate?: string;
}



















