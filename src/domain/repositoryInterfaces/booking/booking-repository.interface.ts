import {
  BookingDetailsWithUserDetailsDto,
  BookingListWithPackageDetailsDto,
  CancelledBookingDetailsWithUserAndPackageDetailsDto,
  IBookingWithPackage,
  PaginatedBookingListWithUserDetails,
  PaginatedCancellationRequests,
} from "../../../application/dto/response/bookingDto";
import {
  VendorRevenueBreakdownDto,
  PackageRevenueBreakdownDto,
  RevenueTrendDataPointDto,
  RecentTransactionDto,
  ProfitVsCommissionDto,
  SalesReportSummaryDto,
} from "../../../application/dto/response/salesReport.dto";
import { IBookingModel } from "../../../infrastructure/database/models/booking.model";
import { BOOKINGSTATUS, BookingStatus } from "../../../shared/constants";
import { IBookingEntity } from "../../entities/booking.entity";
import { IBaseRepository } from "../baseRepository.interface";

export interface IBookingRepository extends IBaseRepository<IBookingEntity> {
  createBooking(data: Partial<IBookingEntity>): Promise<IBookingEntity>;
  findByCustomBookingId(bookingId: string): Promise<IBookingEntity | null>;
  findByBookingId(id: string): Promise<IBookingModel | null>;
  findByUserId(userId: string): Promise<IBookingEntity | null>;
  updateBooking(
    bookingId: string,
    data: Partial<IBookingEntity>
  ): Promise<void>;
  findByPackageIdAndUserId(
    userId: string,
    packageId: string
  ): Promise<IBookingEntity | null>;
  getBookingsByUserIdAndStatus(
    userId: string,
    status: BOOKINGSTATUS[]
  ): Promise<BookingListWithPackageDetailsDto[] | []>;
  findByPackageId(packageId: string): Promise<IBookingEntity[] | []>;
  findByPackageIdWithUserDetails(
    packageId: string,
    searchTerm: string,
    status: BOOKINGSTATUS,
    pageNumber: number,
    pageSize: number
  ): Promise<PaginatedBookingListWithUserDetails>;
  getAllBookingsByUserId(userId: string): Promise<IBookingEntity[] | []>;
  countByPackageIdAndStatus(
    packageId: string,
    status: string[]
  ): Promise<number>;
  getAllConfirmedBookingsByUserIdWithPackageDetails(
    userId: string,
    status: BookingStatus
  ): Promise<IBookingWithPackage[] | []>;

  findByBookingIdWithUserDetails(
    bookingId: string
  ): Promise<BookingDetailsWithUserDetailsDto | null>;
  findCancelledBookingIdWithUserDetails(
    bookingId: string
  ): Promise<CancelledBookingDetailsWithUserAndPackageDetailsDto | null>;

  findCancellationRequests(
    packageIds: string[],
    page: number,
    limit: number,
    searchTerm?: string,
    status?: "cancellation_requested" | "cancelled"
  ): Promise<PaginatedCancellationRequests>;

  findByPackageIdAndStatus(
    packageId: string,
    status: BOOKINGSTATUS
  ): Promise<IBookingEntity[] | []>;

  // Dashboard statistics methods
  getTotalSalesCount(startDate?: Date, endDate?: Date): Promise<number>;
  getUniqueTravellersCount(startDate?: Date, endDate?: Date): Promise<number>;
  getBookingStatusDistribution(
    startDate?: Date,
    endDate?: Date
  ): Promise<Record<string, number>>;
  getRevenueByCategory(
    startDate?: Date,
    endDate?: Date
  ): Promise<Array<{ category: string; revenue: number; bookings: number }>>;
  getTopPackagesByRevenue(
    limit: number,
    startDate?: Date,
    endDate?: Date
  ): Promise<Array<{ packageId: string; packageName: string; revenue: number; bookings: number }>>;

  // -------- Vendor-scoped dashboard methods --------
  getVendorTotalBookingsCount(
    vendorId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<number>;

  getVendorUniqueTravellersCount(
    vendorId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<number>;

  getVendorBookingStatusDistribution(
    vendorId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<Record<string, number>>;

  getVendorRevenueByPackage(
    vendorId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<Array<{ packageId: string; packageName: string; revenue: number }>>;

  getVendorTopPackagesByRevenue(
    vendorId: string,
    limit: number,
    startDate?: Date,
    endDate?: Date
  ): Promise<Array<{ packageId: string; packageName: string; revenue: number; bookings: number }>>;

  getVendorRecentBookings(
    vendorId: string,
    limit: number
  ): Promise<Array<{ bookingId: string; travelerName: string; tripName: string; amount: number; date: Date; status: string }>>;

  getVendorDetailedRevenueByPackage(
    vendorId: string,
    startDate?: Date,
    endDate?: Date,
    packageId?: string,
    bookingStatus?: BOOKINGSTATUS
  ): Promise<Array<{ 
    packageId: string; 
    packageName: string; 
    totalBookings: number; 
    totalRevenue: number; 
    vendorShare: number; 
    adminCommission: number; 
    totalRefunds: number; 
    travellersCount: number;
  }>>;

  getVendorRecentBookingsWithFilters(
    vendorId: string,
    limit: number,
    startDate?: Date,
    endDate?: Date,
    packageId?: string,
    bookingStatus?: BOOKINGSTATUS
  ): Promise<Array<{ bookingId: string; travelerName: string; tripName: string; amount: number; date: Date; status: string }>>;

  // -------- Admin Sales Report methods --------
  getAdminSalesReportSummary(
    startDate?: Date,
    endDate?: Date,
    vendorId?: string,
    packageId?: string
  ): Promise<SalesReportSummaryDto>;

  getAdminVendorRevenueBreakdown(
    startDate?: Date,
    endDate?: Date,
    vendorId?: string
  ): Promise<VendorRevenueBreakdownDto[]>;

  getAdminPackageRevenueBreakdown(
    startDate?: Date,
    endDate?: Date,
    vendorId?: string,
    packageId?: string
  ): Promise<PackageRevenueBreakdownDto[]>;

  getAdminRevenueTrend(
    period: "daily" | "weekly" | "monthly" | "yearly",
    startDate?: Date,
    endDate?: Date,
    vendorId?: string,
    packageId?: string
  ): Promise<RevenueTrendDataPointDto[]>;

  getAdminRecentTransactions(
    limit: number,
    startDate?: Date,
    endDate?: Date,
    vendorId?: string,
    packageId?: string
  ): Promise<RecentTransactionDto[]>;

  getAdminProfitVsCommission(
    startDate?: Date,
    endDate?: Date,
    vendorId?: string
  ): Promise<ProfitVsCommissionDto[]>;
}
