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
    paymentMode?: string
  ): Promise<VendorSalesReportDto> {

    let startDateObj: Date | undefined = undefined;
    let endDateObj: Date | undefined = undefined;
    
    if (startDate) {
      const parsedDate = new Date(startDate);
      if (!isNaN(parsedDate.getTime())) {
        startDateObj = new Date(parsedDate);
        startDateObj.setUTCHours(0, 0, 0, 0);
      }
    }
    
    if (endDate) {
      const parsedDate = new Date(endDate);
      if (!isNaN(parsedDate.getTime())) {
        endDateObj = new Date(parsedDate);
        endDateObj.setUTCHours(23, 59, 59, 999);
      }
    }

    const bookingStatusEnum = bookingStatus ? (bookingStatus as BOOKINGSTATUS) : undefined;

    if (!startDateObj && !endDateObj && period && period !== "custom") {
      const now = new Date();
      const utcNow = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
      
      switch (period) {
        case "daily":      
          startDateObj = new Date(Date.UTC(utcNow.getUTCFullYear(), utcNow.getUTCMonth(), utcNow.getUTCDate(), 0, 0, 0, 0));
          endDateObj = new Date(Date.UTC(utcNow.getUTCFullYear(), utcNow.getUTCMonth(), utcNow.getUTCDate(), 23, 59, 59, 999));
          break;
        case "weekly":        
          const dayOfWeek = utcNow.getUTCDay();
          const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; 
          const startOfWeek = new Date(utcNow);
          startOfWeek.setUTCDate(utcNow.getUTCDate() - daysFromMonday);
          startDateObj = new Date(Date.UTC(startOfWeek.getUTCFullYear(), startOfWeek.getUTCMonth(), startOfWeek.getUTCDate(), 0, 0, 0, 0));
          const endOfWeek = new Date(utcNow);
          endOfWeek.setUTCDate(utcNow.getUTCDate() + (6 - daysFromMonday));
          endDateObj = new Date(Date.UTC(endOfWeek.getUTCFullYear(), endOfWeek.getUTCMonth(), endOfWeek.getUTCDate(), 23, 59, 59, 999));
          break;
        case "monthly":
         
          startDateObj = new Date(Date.UTC(utcNow.getUTCFullYear(), utcNow.getUTCMonth(), 1, 0, 0, 0, 0));
          
          endDateObj = new Date(Date.UTC(utcNow.getUTCFullYear(), utcNow.getUTCMonth() + 1, 0, 23, 59, 59, 999));
          break;
        case "yearly":
          
          startDateObj = new Date(Date.UTC(utcNow.getUTCFullYear(), 0, 1, 0, 0, 0, 0));
          endDateObj = new Date(Date.UTC(utcNow.getUTCFullYear(), 11, 31, 23, 59, 59, 999));
          break;
      }
    }

    console.log("=== Date Calculation Debug ===");
    console.log("Input:", { period, startDate, endDate });
    console.log("Calculated dates (UTC):", {
      startDateObj: startDateObj?.toISOString(),
      endDateObj: endDateObj?.toISOString(),
      startDateObjLocal: startDateObj?.toLocaleString(),
      endDateObjLocal: endDateObj?.toLocaleString(),
    });
    console.log("Will filter by dates:", !!(startDateObj || endDateObj));

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


    // Get refunded bookings count (bookings with refundAmount > 0)
    // We'll need to query this separately or estimate from cancelled bookings
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
}

