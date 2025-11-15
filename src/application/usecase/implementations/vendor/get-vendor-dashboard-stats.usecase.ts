import { inject, injectable } from "tsyringe";

import { VendorDashboardStatsDto } from "../../../dto/response/vendor-dashboard.dto";
import { VENDOR_DASHBOARD_PERIOD } from "../../../dto/request/vendor-dashboard.dto";
import { IBookingRepository } from "../../../../domain/repositoryInterfaces/booking/booking-repository.interface";
import { IPackageRepository } from "../../../../domain/repositoryInterfaces/package/package-repository.interface";
import { IWalletTransactionsRepository } from "../../../../domain/repositoryInterfaces/wallet/wallet-transactions-repository.interface";
import { IGetVendorDashboardStatsUsecase } from "../../interfaces/vendor/get-vendor-dashboard-stats-usecase.interface";

@injectable()
export class GetVendorDashboardStatsUsecase implements IGetVendorDashboardStatsUsecase {
  constructor(
    @inject("IBookingRepository")
    private _bookingRepository: IBookingRepository,

    @inject("IPackageRepository")
    private _packageRepository: IPackageRepository,

    @inject("IWalletTransactionsRepository")
    private _walletTransactionsRepository: IWalletTransactionsRepository
  ) {}

  async execute(
    vendorId: string,
    period: VENDOR_DASHBOARD_PERIOD = "monthly",
    startDate?: string,
    endDate?: string
  ): Promise<VendorDashboardStatsDto> {
    const startDateObj = startDate ? new Date(startDate) : undefined;
    const endDateObj = endDate ? new Date(endDate) : undefined;


    const [
      totalBookings,
      totalTravellers,
      bookingStatusDistribution,
      totalVendorRevenue,
      totalRefundedAmount,
      revenueTrend,
      revenueBreakdownByPackage,
      profitVsCommissionByTrip,
      recentBookings,
      totalPackages,
    ] = await Promise.all([
      this._bookingRepository.getVendorTotalBookingsCount(
        vendorId,
        startDateObj,
        endDateObj
      ),
      this._bookingRepository.getVendorUniqueTravellersCount(
        vendorId,
        startDateObj,
        endDateObj
      ),
      this._bookingRepository.getVendorBookingStatusDistribution(
        vendorId,
        startDateObj,
        endDateObj
      ),
      this._walletTransactionsRepository.getVendorTotalRevenue(
        vendorId,
        startDateObj,
        endDateObj
      ),
      this._walletTransactionsRepository.getVendorRefundedAmount(
        vendorId,
        startDateObj,
        endDateObj
      ),
      this._walletTransactionsRepository.getVendorRevenueTrend(
        vendorId,
        period,
        startDateObj,
        endDateObj
      ),
      this._bookingRepository.getVendorRevenueByPackage(
        vendorId,
        startDateObj,
        endDateObj
      ),
      this._walletTransactionsRepository.getVendorProfitVsCommissionByTrip(
        vendorId,
        startDateObj,
        endDateObj
      ),
      this._bookingRepository.getVendorRecentBookings(vendorId, 10),
      this._packageRepository.findByAgencyId(vendorId).then((p) => p.length),
    ]);


    const totalRevenue = totalVendorRevenue / 0.9; 
    
    return {
      totalBookings,
      confirmedBookings: bookingStatusDistribution["completed"] || 0,
      cancelledBookings: bookingStatusDistribution["cancelled"] || 0,
      totalRevenue,
      totalVendorRevenue,
      totalRefundedAmount,
      totalPackages,
      totalTravellers,
      revenueTrend: revenueTrend.map((p) => ({
        date: p.date,
        revenue: p.revenue,
        adminCommission: p.adminCommission,
        vendorShare: p.vendorShare,
      })),
      revenueBreakdownByPackage,
      profitVsCommissionByTrip,
      paymentModeDistribution: await this._walletTransactionsRepository.getVendorPaymentModeDistribution(
        vendorId,
        startDateObj,
        endDateObj
      ),
      bookingStatusDistribution,
      recentBookings: recentBookings.map((r) => ({
        bookingId: r.bookingId,
        travelerName: r.travelerName,
        tripName: r.tripName,
        amount: r.amount,
        date: r.date.toISOString(),
        status: r.status,
      })),
    };
  }

}











