import { PaginatedWalletTransactions } from "../../../application/dto/response/walletDto";
import {  TRANSACTION_TYPE_FILTER } from "../../../shared/constants";
import { IWalletTransactionEntity } from "../../entities/walletTransactions.entity";
import { IBaseRepository } from "../baseRepository.interface";

export interface IWalletTransactionsRepository
  extends IBaseRepository<IWalletTransactionEntity> {
  getWalletTransactions(
    walletId: string,
    page: number,
    limit: number,
    type: TRANSACTION_TYPE_FILTER,
    searchTerm: string,
    sortby: "newest" | "oldest"
  ): Promise<PaginatedWalletTransactions>;
  getAdminRevenue(startDate?: Date, endDate?: Date): Promise<number>;
  getAgencyRevenue(startDate?: Date, endDate?: Date): Promise<number>;
  getRevenueTrend(
    period: "daily" | "weekly" | "monthly" | "yearly",
    startDate?: Date,
    endDate?: Date
  ): Promise<Array<{ date: string; revenue: number; adminRevenue: number; agencyRevenue: number;}>>;
  getTopAgenciesByRevenue(
    limit: number,
    startDate?: Date,
    endDate?: Date
  ): Promise<Array<{ agencyId: string; agencyName: string; revenue: number; bookings: number }>>;

  getVendorTotalRevenue(
    vendorId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<number>;

  getVendorRefundedAmount(
    vendorId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<number>;

  getVendorRevenueTrend(
    vendorId: string,
    period: "daily" | "weekly" | "monthly" | "yearly",
    startDate?: Date,
    endDate?: Date
  ): Promise<Array<{ date: string; revenue: number; adminCommission: number; vendorShare: number }>>;

  getVendorProfitVsCommissionByTrip(
    vendorId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<Array<{ tripId: string; tripName: string; vendorShare: number; adminCommission: number }>>;

  getVendorPaymentModeDistribution(
    vendorId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<Array<{ mode: string; amount: number }>>;
}
