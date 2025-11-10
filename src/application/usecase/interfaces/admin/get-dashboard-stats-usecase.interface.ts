import { DashboardStatsDto } from "../../../dto/response/dashboard.dto";
import { DASHBOARD_PERIOD } from "../../../dto/request/admin.dto";

export interface IGetDashboardStatsUsecase {
  execute(
    period?: DASHBOARD_PERIOD,
    startDate?: string,
    endDate?: string
  ): Promise<DashboardStatsDto>;
}







