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
    let startDateObj: Date | undefined = undefined;
    let endDateObj: Date | undefined = undefined;

    // If both startDate and endDate are explicitly provided, use them
    // Otherwise, calculate date range based on period
    if (startDate && endDate) {
      const parsedStartDate = new Date(startDate);
      const parsedEndDate = new Date(endDate);
      
      if (!isNaN(parsedStartDate.getTime())) {
        startDateObj = new Date(parsedStartDate);
        startDateObj.setUTCHours(0, 0, 0, 0);
      }
      
      if (!isNaN(parsedEndDate.getTime())) {
        endDateObj = new Date(parsedEndDate);
        endDateObj.setUTCHours(23, 59, 59, 999);
      }
    }

    // Calculate date range based on period if dates were not both provided
    if (!startDateObj || !endDateObj) {
      const dateRange = this._calculateDateRangeForPeriod(period);
      startDateObj = dateRange.startDate;
      endDateObj = dateRange.endDate;
    }


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

  /**
   * Calculates the start and end dates for a given period
   * @param period - The period type (daily, weekly, monthly, yearly)
   * @returns An object containing startDate and endDate
   */
  private _calculateDateRangeForPeriod(
    period: VENDOR_DASHBOARD_PERIOD
  ): { startDate: Date; endDate: Date } {
    const now = new Date();
    const utcNow = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
    );

    switch (period) {
      case "daily": {
        const startDate = new Date(
          Date.UTC(
            utcNow.getUTCFullYear(),
            utcNow.getUTCMonth(),
            utcNow.getUTCDate(),
            0,
            0,
            0,
            0
          )
        );
        const endDate = new Date(
          Date.UTC(
            utcNow.getUTCFullYear(),
            utcNow.getUTCMonth(),
            utcNow.getUTCDate(),
            23,
            59,
            59,
            999
          )
        );
        return { startDate, endDate };
      }

      case "weekly": {
        const dayOfWeek = utcNow.getUTCDay();
        const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        const startOfWeek = new Date(utcNow);
        startOfWeek.setUTCDate(utcNow.getUTCDate() - daysFromMonday);
        const startDate = new Date(
          Date.UTC(
            startOfWeek.getUTCFullYear(),
            startOfWeek.getUTCMonth(),
            startOfWeek.getUTCDate(),
            0,
            0,
            0,
            0
          )
        );
        const endOfWeek = new Date(utcNow);
        endOfWeek.setUTCDate(utcNow.getUTCDate() + (6 - daysFromMonday));
        const endDate = new Date(
          Date.UTC(
            endOfWeek.getUTCFullYear(),
            endOfWeek.getUTCMonth(),
            endOfWeek.getUTCDate(),
            23,
            59,
            59,
            999
          )
        );
        return { startDate, endDate };
      }

      case "monthly": {
        const startDate = new Date(
          Date.UTC(utcNow.getUTCFullYear(), utcNow.getUTCMonth(), 1, 0, 0, 0, 0)
        );
        const endDate = new Date(
          Date.UTC(
            utcNow.getUTCFullYear(),
            utcNow.getUTCMonth() + 1,
            0,
            23,
            59,
            59,
            999
          )
        );
        return { startDate, endDate };
      }

      case "yearly": {
        const startDate = new Date(
          Date.UTC(utcNow.getUTCFullYear(), 0, 1, 0, 0, 0, 0)
        );
        const endDate = new Date(
          Date.UTC(utcNow.getUTCFullYear(), 11, 31, 23, 59, 59, 999)
        );
        return { startDate, endDate };
      }

      default: {
        // Fallback to monthly if period is invalid
        const startDate = new Date(
          Date.UTC(utcNow.getUTCFullYear(), utcNow.getUTCMonth(), 1, 0, 0, 0, 0)
        );
        const endDate = new Date(
          Date.UTC(
            utcNow.getUTCFullYear(),
            utcNow.getUTCMonth() + 1,
            0,
            23,
            59,
            59,
            999
          )
        );
        return { startDate, endDate };
      }
    }
  }
}



















