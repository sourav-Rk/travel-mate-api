import { VendorDashboardStatsDto } from "../../../dto/response/vendor-dashboard.dto";
import { VENDOR_DASHBOARD_PERIOD } from "../../../dto/request/vendor-dashboard.dto";

export interface IGetVendorDashboardStatsUsecase {
  execute(
    vendorId: string,
    period: VENDOR_DASHBOARD_PERIOD,
    startDate?: string,
    endDate?: string
  ): Promise<VendorDashboardStatsDto>;
}











