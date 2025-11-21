import { inject, injectable } from "tsyringe";

import { IBookingRepository } from "../../../../domain/repositoryInterfaces/booking/booking-repository.interface";
import { IPackageRepository } from "../../../../domain/repositoryInterfaces/package/package-repository.interface";
import { IVendorRepository } from "../../../../domain/repositoryInterfaces/vendor/vendor-repository.interface";
import { IWalletTransactionsRepository } from "../../../../domain/repositoryInterfaces/wallet/wallet-transactions-repository.interface";
import { DASHBOARD_PERIOD } from "../../../dto/request/admin.dto";
import { DashboardStatsDto } from "../../../dto/response/dashboard.dto";
import { DashboardMapper } from "../../../mapper/dashboard.mapper";
import { IGetDashboardStatsUsecase } from "../../interfaces/admin/get-dashboard-stats-usecase.interface";

@injectable()
export class GetDashboardStatsUsecase implements IGetDashboardStatsUsecase {
  constructor(
    @inject("IBookingRepository")
    private _bookingRepository: IBookingRepository,

    @inject("IVendorRepository")
    private _vendorRepository: IVendorRepository,

    @inject("IWalletTransactionsRepository")
    private _walletTransactionsRepository: IWalletTransactionsRepository,

    @inject("IPackageRepository")
    private _packageRepository: IPackageRepository
  ) {}

  async execute(
    period: Exclude<DASHBOARD_PERIOD, DASHBOARD_PERIOD.CUSTOM> = DASHBOARD_PERIOD.MONTHLY,
    startDate?: string,
    endDate?: string
  ): Promise<DashboardStatsDto> {
    const startDateObj = startDate ? new Date(startDate) : undefined;
    const endDateObj = endDate ? new Date(endDate) : undefined;

    const [
      totalSales,
      totalTravellers,
      totalAgencies,
      adminRevenue,
      agencyRevenue,
      bookingStatusDistribution,
      revenueTrend,
      topAgencies,
      categoryPerformance,
      totalPackages,
      completedPackages,
      topPackages,
    ] = await Promise.all([
      this._bookingRepository.getTotalSalesCount(startDateObj, endDateObj),
      this._bookingRepository.getUniqueTravellersCount(
        startDateObj,
        endDateObj
      ),
      this._vendorRepository.getTotalAgenciesCount(),
      this._walletTransactionsRepository.getAdminRevenue(
        startDateObj,
        endDateObj
      ),
      this._walletTransactionsRepository.getAgencyRevenue(
        startDateObj,
        endDateObj
      ),
      this._bookingRepository.getBookingStatusDistribution(
        startDateObj,
        endDateObj
      ),
      this._walletTransactionsRepository.getRevenueTrend(
        period,
        startDateObj,
        endDateObj
      ),
      this._walletTransactionsRepository.getTopAgenciesByRevenue(
        10,
        startDateObj,
        endDateObj
      ),
      this._bookingRepository.getRevenueByCategory(startDateObj, endDateObj),
      this._packageRepository.countAllPackages(),
      this._packageRepository.countCompletedPackages(),
      this._bookingRepository.getTopPackagesByRevenue(
        5,
        startDateObj,
        endDateObj
      ),
    ]);

    const totalRevenue = adminRevenue + agencyRevenue;

    const dashboardStats: DashboardStatsDto = {
      totalSales,
      totalTravellers,
      totalAgencies,
      totalRevenue,
      adminRevenue,
      agencyRevenue,
      totalPackages: totalPackages ?? 0,
      completedPackages: completedPackages ?? 0,
      revenueTrend,
      revenueDistribution: {
        admin: adminRevenue,
        agency: agencyRevenue,
      },
      bookingStatusDistribution: DashboardMapper.mapToBookingStatusDistribution(
        bookingStatusDistribution
      ),
      topAgencies: topAgencies.map((agency) =>
        DashboardMapper.mapToTopAgencies(agency)
      ),
      categoryPerformance: categoryPerformance.map((cat) =>
        DashboardMapper.mapToCategoryPerformance(cat)
      ),
      topPackages: topPackages,
    };

    return dashboardStats;
  }
}
