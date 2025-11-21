import { DASHBOARD_PERIOD } from "../../../dto/request/admin.dto";
import { AdminSalesReportDto } from "../../../dto/response/salesReport.dto";

export interface IGetAdminSalesReportUsecase {
  execute(
    period?: DASHBOARD_PERIOD,
    startDate?: string,
    endDate?: string,
    vendorId?: string,
    packageId?: string
  ): Promise<AdminSalesReportDto>;
}

















