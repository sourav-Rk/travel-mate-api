import { inject, injectable } from "tsyringe";

import { AdminSalesReportDto } from "../../../dto/response/salesReport.dto";
import { DASHBOARD_PERIOD } from "../../../dto/request/admin.dto";
import { IBookingRepository } from "../../../../domain/repositoryInterfaces/booking/booking-repository.interface";
import { IGetAdminSalesReportUsecase } from "../../interfaces/admin/get-admin-sales-report-usecase.interface";

@injectable()
export class GetAdminSalesReportUsecase implements IGetAdminSalesReportUsecase {
  constructor(
    @inject("IBookingRepository")
    private _bookingRepository: IBookingRepository
  ) {}

  async execute(
    period: DASHBOARD_PERIOD = DASHBOARD_PERIOD.MONTHLY,
    startDate?: string,
    endDate?: string,
    vendorId?: string,
    packageId?: string
  ): Promise<AdminSalesReportDto> {
    const startDateObj = startDate ? new Date(startDate) : undefined;
    const endDateObj = endDate ? new Date(endDate) : undefined;

    const periodStr: "daily" | "weekly" | "monthly" | "yearly" =
      period === DASHBOARD_PERIOD.CUSTOM
        ? DASHBOARD_PERIOD.MONTHLY
        : (period as "daily" | "weekly" | "monthly" | "yearly");

    const [
      summary,
      vendorBreakdown,
      packageBreakdown,
      revenueTrend,
      recentTransactions,
      profitVsCommission,
    ] = await Promise.all([
      this._bookingRepository.getAdminSalesReportSummary(
        startDateObj,
        endDateObj,
        vendorId,
        packageId
      ),
      this._bookingRepository.getAdminVendorRevenueBreakdown(
        startDateObj,
        endDateObj,
        vendorId
      ),
      this._bookingRepository.getAdminPackageRevenueBreakdown(
        startDateObj,
        endDateObj,
        vendorId,
        packageId
      ),
      this._bookingRepository.getAdminRevenueTrend(
        periodStr,
        startDateObj,
        endDateObj,
        vendorId,
        packageId
      ),
      this._bookingRepository.getAdminRecentTransactions(
        50,
        startDateObj,
        endDateObj,
        vendorId,
        packageId
      ),
      this._bookingRepository.getAdminProfitVsCommission(
        startDateObj,
        endDateObj,
        vendorId
      ),
    ]);

    return {
      summary,
      vendorBreakdown,
      packageBreakdown,
      revenueTrend,
      recentTransactions,
      profitVsCommission,
    };
  }
}

