import { inject, injectable } from "tsyringe";

import { VendorSalesReportDto, VendorSalesReportSummaryDto, VendorSalesReportRevenueBreakdownDto, VendorSalesReportRevenueTrendDto, VendorSalesReportProfitVsCommissionDto, VendorSalesReportLatestBookingDto } from "../../../dto/response/vendor-sales-report.dto";
import { VENDOR_SALES_REPORT_PERIOD } from "../../../dto/request/vendor-sales-report.dto";
import { IBookingRepository } from "../../../../domain/repositoryInterfaces/booking/booking-repository.interface";
import { IPackageRepository } from "../../../../domain/repositoryInterfaces/package/package-repository.interface";
import { IWalletTransactionsRepository } from "../../../../domain/repositoryInterfaces/wallet/wallet-transactions-repository.interface";
import { IGetVendorSalesReportUsecase } from "../../interfaces/vendor/get-vendor-sales-report-usecase.interface";
import { BOOKINGSTATUS } from "../../../../shared/constants";

@injectable()
export class GetVendorSalesReportUsecase implements IGetVendorSalesReportUsecase {
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
    period: VENDOR_SALES_REPORT_PERIOD = "monthly",
    startDate?: string,
    endDate?: string,
    packageId?: string,
    bookingStatus?: string,
  ): Promise<VendorSalesReportDto> {
    const bookingStatusEnum = bookingStatus ? (bookingStatus as BOOKINGSTATUS) : undefined;

    // Calculate date range based on period and provided dates
    const { startDate: startDateObj, endDate: endDateObj } = this._getPeriodDateRange(
      period,
      startDate,
      endDate
    );

    const [
      totalBookings,
      totalTravellers,
      bookingStatusDistribution,
      totalVendorRevenue,
      totalRefundedAmount,
      revenueTrend,
      revenueBreakdown,
      profitVsCommission,
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
        period === "custom" ? "daily" : period,
        startDateObj,
        endDateObj
      ),
      this._bookingRepository.getVendorDetailedRevenueByPackage(
        vendorId,
        startDateObj,
        endDateObj,
        packageId,
        bookingStatusEnum
      ),
      this._walletTransactionsRepository.getVendorProfitVsCommissionByTrip(
        vendorId,
        startDateObj,
        endDateObj
      ),
      this._bookingRepository.getVendorRecentBookingsWithFilters(
        vendorId,
        50,
        startDateObj,
        endDateObj,
        packageId,
        bookingStatusEnum
      ),
      this._packageRepository.findByAgencyId(vendorId).then((p) => p.length),
    ]);

    const totalRevenue = totalVendorRevenue > 0 ? totalVendorRevenue / 0.9 : 0;
    const totalAdminCommission = totalRevenue * 0.1;


    /**
     * Get refunded bookings count (bookings with refundAmount > 0)
     *  We'll need to query this separately or estimate from cancelled bookings
     */
    const refundedBookings = bookingStatusDistribution[BOOKINGSTATUS.CANCELLED] || 0;

    const summary: VendorSalesReportSummaryDto = {
      totalRevenue,
      totalVendorRevenue,
      totalAdminCommission,
      totalRefundAmount: totalRefundedAmount,
      totalBookings,
      confirmedBookings: bookingStatusDistribution[BOOKINGSTATUS.CONFIRMED] || 0,
      cancelledBookings: bookingStatusDistribution[BOOKINGSTATUS.CANCELLED] || 0,
      refundedBookings,
      totalTravellers,
      totalPackages,
    };

    const revenueBreakdownMapped: VendorSalesReportRevenueBreakdownDto[] = revenueBreakdown.map((item) => ({
      packageId: item.packageId,
      packageName: item.packageName,
      totalBookings: item.totalBookings,
      totalRevenue: item.totalRevenue,
      vendorShare: item.vendorShare,
      adminCommission: item.adminCommission,
      totalRefunds: item.totalRefunds,
      travellersCount: item.travellersCount,
    }));

    const revenueTrendMapped: VendorSalesReportRevenueTrendDto[] = revenueTrend.map((item) => ({
      date: item.date,
      totalRevenue: item.revenue,
      vendorShare: item.vendorShare,
      adminCommission: item.adminCommission,
    }));

 
    const profitVsCommissionMapped: VendorSalesReportProfitVsCommissionDto[] = profitVsCommission.map((item) => ({
      tripId: item.tripId,
      tripName: item.tripName,
      vendorShare: item.vendorShare,
      adminCommission: item.adminCommission,
    }));


    const latestBookingsMapped: VendorSalesReportLatestBookingDto[] = recentBookings.map((item) => ({
      bookingId: item.bookingId,
      tripName: item.tripName,
      travelerName: item.travelerName,
      amount: item.amount,
      date: item.date.toISOString(),
      status: item.status,
    }));

    return {
      summary,
      revenueBreakdown: revenueBreakdownMapped,
      revenueTrend: revenueTrendMapped,
      profitVsCommission: profitVsCommissionMapped,
      latestBookings: latestBookingsMapped,
    };
  }

  /**
   * Calculates the start and end dates for a given period
   * @param period - The period type (daily, weekly, monthly, yearly, custom)
   * @param inputStartDate - Optional start date string
   * @param inputEndDate - Optional end date string
   * @returns An object containing startDate and endDate
   */
  private _getPeriodDateRange(
    period: VENDOR_SALES_REPORT_PERIOD,
    inputStartDate?: string,
    inputEndDate?: string
  ): { startDate: Date | undefined; endDate: Date | undefined } {
    // Normalize empty strings to undefined
    const normalizedStartDate = inputStartDate && inputStartDate.trim() !== "" ? inputStartDate : undefined;
    const normalizedEndDate = inputEndDate && inputEndDate.trim() !== "" ? inputEndDate : undefined;

    // If period is "custom", only use provided dates
    if (period === "custom") {
      let startDate: Date | undefined = undefined;
      let endDate: Date | undefined = undefined;

      if (normalizedStartDate) {
        const parsedDate = new Date(normalizedStartDate);
        if (!isNaN(parsedDate.getTime())) {
          startDate = new Date(parsedDate);
          startDate.setUTCHours(0, 0, 0, 0);
        }
      }

      if (normalizedEndDate) {
        const parsedDate = new Date(normalizedEndDate);
        if (!isNaN(parsedDate.getTime())) {
          endDate = new Date(parsedDate);
          endDate.setUTCHours(23, 59, 59, 999);
        }
      }
      return { startDate, endDate };
    }

    // For non-custom periods, if both dates are explicitly provided and valid, use them
    if (normalizedStartDate && normalizedEndDate) {
      const parsedStartDate = new Date(normalizedStartDate);
      const parsedEndDate = new Date(normalizedEndDate);

      if (!isNaN(parsedStartDate.getTime()) && !isNaN(parsedEndDate.getTime())) {
        const startDate = new Date(parsedStartDate);
        startDate.setUTCHours(0, 0, 0, 0);
        const endDate = new Date(parsedEndDate);
        endDate.setUTCHours(23, 59, 59, 999);
        return { startDate, endDate };
      }
    }

    // Calculate date range based on period
    // At this point, period cannot be "custom" because we returned early
    const dateRange = this._calculateDateRangeForPeriod(
      period as Exclude<VENDOR_SALES_REPORT_PERIOD, "custom">
    );
    return { startDate: dateRange.startDate, endDate: dateRange.endDate };
  }

  /**
   * Calculates the start and end dates for a given period
   * @param period - The period type (daily, weekly, monthly, yearly)
   * @returns An object containing startDate and endDate
   */
  private _calculateDateRangeForPeriod(
    period: Exclude<VENDOR_SALES_REPORT_PERIOD, "custom">
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
