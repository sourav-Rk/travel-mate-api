import { DASHBOARD_PERIOD } from "../../../dto/request/admin.dto";
import { DashboardStatsDto } from "../../../dto/response/dashboard.dto";

export interface IGetDashboardStatsUsecase {
  execute(
    period?: DASHBOARD_PERIOD,
    startDate?: string,
    endDate?: string
  ): Promise<DashboardStatsDto>;
}

























