import mongoose, { FilterQuery, PipelineStage } from "mongoose";
import { injectable } from "tsyringe";

import { PaginatedWalletTransactions } from "../../../application/dto/response/walletDto";
import { WalletTransactionsMapper } from "../../../application/mapper/wallet-transactions.mapper";
import { IWalletTransactionEntity } from "../../../domain/entities/walletTransactions.entity";
import { IWalletTransactionsRepository } from "../../../domain/repositoryInterfaces/wallet/wallet-transactions-repository.interface";
import { TRANSACTION_TYPE_FILTER } from "../../../shared/constants";
import {
  IWalletTransactionsModel,
  walletTransactionsDB,
} from "../../database/models/walletTransactions.model";
import { BaseRepository } from "../baseRepository";

@injectable()
export class WalletTransactionsRepository
  extends BaseRepository<IWalletTransactionsModel, IWalletTransactionEntity>
  implements IWalletTransactionsRepository
{
  constructor() {
    super(walletTransactionsDB, WalletTransactionsMapper.toEntity);
  }

  async getWalletTransactions(
    walletId: string,
    page = 1,
    limit = 10,
    type: TRANSACTION_TYPE_FILTER,
    searchTerm: string,
    sortby: "newest" | "oldest"
  ): Promise<PaginatedWalletTransactions> {
    const skip = (page - 1) * limit;
    const filter: FilterQuery<IWalletTransactionsModel> = { walletId };

    if (type && type !== "all") {
      filter.type = type;
    }

    const sortBy: { [key: string]: 1 | -1 } = {};

    if (sortby === "oldest") {
      sortBy.createdAt = 1;
    } else {
      sortBy.createdAt = -1;
    }
    if (searchTerm) {
      filter.$or = [
        { referenceId: { $regex: searchTerm, $options: "i" } },
        { description: { $regex: searchTerm, $options: "i" } },
      ];

      const amountNumber = Number(searchTerm);
      if (!isNaN(amountNumber)) {
        filter.$or.push({ amount: amountNumber });
      }
    }

    const [wallet, total] = await Promise.all([
      walletTransactionsDB.find(filter).sort(sortBy).skip(skip).limit(limit),
      walletTransactionsDB.countDocuments(filter),
    ]);

    const data = wallet.map((w) => WalletTransactionsMapper.toEntity(w));

    return {
      data,
      total,
    };
  }

  // Dashboard statistics methods
  async getAdminRevenue(startDate?: Date, endDate?: Date): Promise<number> {
    const pipeline: PipelineStage[] = [
      {
        $lookup: {
          from: "wallets",
          localField: "walletId",
          foreignField: "_id",
          as: "wallet",
        },
      },
      {
        $unwind: "$wallet",
      },
      {
        $match: {
          "wallet.userType": "admin",
          type: "credit",
        },
      },
    ];

    if (startDate || endDate) {
      const dateFilter: { $gte?: Date; $lte?: Date } = {};
      if (startDate) dateFilter.$gte = startDate;
      if (endDate) dateFilter.$lte = endDate;
      pipeline.push({
        $match: {
          createdAt: dateFilter,
        },
      });
    }

    pipeline.push({
      $group: {
        _id: null,
        totalRevenue: { $sum: "$amount" },
      },
    });

    const result = await walletTransactionsDB.aggregate(pipeline);
    return result.length > 0 ? result[0].totalRevenue : 0;
  }

  async getAgencyRevenue(startDate?: Date, endDate?: Date): Promise<number> {
    const pipeline: PipelineStage[] = [
      {
        $lookup: {
          from: "wallets",
          localField: "walletId",
          foreignField: "_id",
          as: "wallet",
        },
      },
      {
        $unwind: "$wallet",
      },
      {
        $match: {
          "wallet.userType": "vendor",
          type: "credit",
        },
      },
    ];

    if (startDate || endDate) {
      const dateFilter: { $gte?: Date; $lte?: Date } = {};
      if (startDate) dateFilter.$gte = startDate;
      if (endDate) dateFilter.$lte = endDate;
      pipeline.push({
        $match: {
          createdAt: dateFilter,
        },
      });
    }

    pipeline.push({
      $group: {
        _id: null,
        totalRevenue: { $sum: "$amount" },
      },
    });

    const result = await walletTransactionsDB.aggregate(pipeline);
    return result.length > 0 ? result[0].totalRevenue : 0;
  }

  async getRevenueTrend(
    period: "daily" | "weekly" | "monthly" | "yearly",
    startDate?: Date,
    endDate?: Date
  ): Promise<
    Array<{
      date: string;
      revenue: number;
      adminRevenue: number;
      agencyRevenue: number;
    }>
  > {
    const matchStage: FilterQuery<IWalletTransactionsModel> = {
      type: "credit",
    };

    if (startDate || endDate) {
      matchStage.createdAt = {};
      if (startDate) matchStage.createdAt.$gte = startDate;
      if (endDate) matchStage.createdAt.$lte = endDate;
    }

    let dateFormat: Record<string, unknown> = {};
    switch (period) {
      case "daily":
        dateFormat = {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          day: { $dayOfMonth: "$createdAt" },
        };
        break;
      case "weekly":
        dateFormat = {
          isoWeekYear: { $isoWeekYear: "$createdAt" },
          isoWeek: { $isoWeek: "$createdAt" },
        };
        break;
      case "monthly":
        dateFormat = {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        };
        break;
      case "yearly":
        dateFormat = {
          year: { $year: "$createdAt" },
        };
        break;
    }

    const pipeline: PipelineStage[] = [
      { $match: matchStage },
      {
        $lookup: {
          from: "wallets",
          localField: "walletId",
          foreignField: "_id",
          as: "wallet",
        },
      },
      { $unwind: "$wallet" },
      {
        $group: {
          _id: {
            date: dateFormat,
            userType: "$wallet.userType",
          },
          revenue: { $sum: "$amount" },
        },
      },
      {
        $group: {
          _id: "$_id.date",
          adminRevenue: {
            $sum: {
              $cond: [{ $eq: ["$_id.userType", "admin"] }, "$revenue", 0],
            },
          },
          agencyRevenue: {
            $sum: {
              $cond: [{ $eq: ["$_id.userType", "vendor"] }, "$revenue", 0],
            },
          },
        },
      },

      ...(period === "weekly"
        ? [
            {
              $project: {
                _id: 0,
                date: {
                  $concat: [
                    { $toString: "$_id.isoWeekYear" },
                    "-W",
                    {
                      $cond: [
                        { $lt: ["$_id.isoWeek", 10] },
                        { $concat: ["0", { $toString: "$_id.isoWeek" }] },
                        { $toString: "$_id.isoWeek" },
                      ],
                    },
                  ],
                },
                adminRevenue: 1,
                agencyRevenue: 1,
                revenue: { $add: ["$adminRevenue", "$agencyRevenue"] },
              },
            },
          ]
        : [
            {
              $project: {
                _id: 0,
                date: {
                  $dateToString: {
                    format:
                      period === "daily"
                        ? "%Y-%m-%d"
                        : period === "monthly"
                        ? "%Y-%m"
                        : "%Y",
                    date: {
                      $dateFromParts:
                        period === "daily"
                          ? {
                              year: "$_id.year",
                              month: "$_id.month",
                              day: "$_id.day",
                            }
                          : period === "monthly"
                          ? { year: "$_id.year", month: "$_id.month" }
                          : { year: "$_id.year" },
                    },
                  },
                },
                adminRevenue: 1,
                agencyRevenue: 1,
                revenue: { $add: ["$adminRevenue", "$agencyRevenue"] },
              },
            },
          ]),
      { $sort: { date: 1 } },
    ];

    return await walletTransactionsDB.aggregate(pipeline);
  }

  async getTopAgenciesByRevenue(
    limit: number,
    startDate?: Date,
    endDate?: Date
  ): Promise<
    Array<{
      agencyId: string;
      agencyName: string;
      revenue: number;
      bookings: number;
    }>
  > {
    const matchStage: FilterQuery<IWalletTransactionsModel> = {
      type: "credit",
    };

    if (startDate || endDate) {
      matchStage.createdAt = {};
      if (startDate) matchStage.createdAt.$gte = startDate;
      if (endDate) matchStage.createdAt.$lte = endDate;
    }

    const pipeline: PipelineStage[] = [
      { $match: matchStage },
      {
        $lookup: {
          from: "wallets",
          localField: "walletId",
          foreignField: "_id",
          as: "wallet",
        },
      },
      {
        $unwind: "$wallet",
      },
      {
        $match: {
          "wallet.userType": "vendor",
        },
      },
      {
        $lookup: {
          from: "vendors",
          localField: "wallet.userId",
          foreignField: "_id",
          as: "vendor",
        },
      },
      {
        $unwind: "$vendor",
      },
      {
        $group: {
          _id: "$wallet.userId",
          agencyId: { $first: "$wallet.userId" },
          agencyName: { $first: "$vendor.agencyName" },
          revenue: { $sum: "$amount" },
          bookings: {
            $sum: {
              $cond: [
                {
                  $regexMatch: {
                    input: "$description",
                    regex: /booking/i,
                  },
                },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          agencyId: { $toString: "$agencyId" },
          agencyName: 1,
          revenue: 1,
          bookings: 1,
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: limit },
    ];

    return await walletTransactionsDB.aggregate(pipeline);
  }

  // -------- Vendor-scoped dashboard implementations --------
  async getVendorTotalRevenue(
    vendorId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<number> {
    const matchStage: FilterQuery<IWalletTransactionsModel> = {
      type: "credit",
    };

    if (startDate || endDate) {
      matchStage.createdAt = {};
      if (startDate) matchStage.createdAt.$gte = startDate;
      if (endDate) matchStage.createdAt.$lte = endDate;
    }

    const vendorObjectId = new mongoose.Types.ObjectId(vendorId);

    const pipeline: PipelineStage[] = [
      { $match: matchStage },
      {
        $lookup: {
          from: "wallets",
          localField: "walletId",
          foreignField: "_id",
          as: "wallet",
        },
      },
      { $unwind: "$wallet" },
      {
        $match: {
          "wallet.userType": "vendor",
          "wallet.userId": vendorObjectId,
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ];

    const result = await walletTransactionsDB.aggregate(pipeline);
    return result[0]?.total || 0;
  }

  async getVendorRefundedAmount(
    vendorId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<number> {
    const matchStage: FilterQuery<IWalletTransactionsModel> = {
      type: "debit",
    };
    if (startDate || endDate) {
      matchStage.createdAt = {};
      if (startDate) matchStage.createdAt.$gte = startDate;
      if (endDate) matchStage.createdAt.$lte = endDate;
    }

    const vendorObjectId = new mongoose.Types.ObjectId(vendorId);

    const pipeline: PipelineStage[] = [
      { $match: matchStage },
      {
        $lookup: {
          from: "wallets",
          localField: "walletId",
          foreignField: "_id",
          as: "wallet",
        },
      },
      { $unwind: "$wallet" },
      {
        $match: {
          "wallet.userType": "vendor",
          "wallet.userId": vendorObjectId,
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ];

    const result = await walletTransactionsDB.aggregate(pipeline);
    return result[0]?.total || 0;
  }

  async getVendorRevenueTrend(
    vendorId: string,
    period: "daily" | "weekly" | "monthly" | "yearly",
    startDate?: Date,
    endDate?: Date
  ): Promise<
    Array<{
      date: string;
      revenue: number;
      adminCommission: number;
      vendorShare: number;
    }>
  > {
    const vendorObjectId = new mongoose.Types.ObjectId(vendorId);
    const matchStage: FilterQuery<IWalletTransactionsModel> = {};
    if (startDate || endDate) {
      matchStage.createdAt = {};
      if (startDate) matchStage.createdAt.$gte = startDate;
      if (endDate) matchStage.createdAt.$lte = endDate;
    }

    let dateFormat: Record<string, unknown> = {};
    switch (period) {
      case "daily":
        dateFormat = {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          day: { $dayOfMonth: "$createdAt" },
        };
        break;
      case "weekly":
        dateFormat = {
          isoWeekYear: { $isoWeekYear: "$createdAt" },
          isoWeek: { $isoWeek: "$createdAt" },
        };
        break;
      case "monthly":
        dateFormat = {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        };
        break;
      case "yearly":
        dateFormat = { year: { $year: "$createdAt" } };
        break;
    }

    const pipeline: PipelineStage[] = [
      { $match: matchStage },
      {
        $lookup: {
          from: "wallets",
          localField: "walletId",
          foreignField: "_id",
          as: "wallet",
        },
      },
      { $unwind: "$wallet" },
      {
        $match: {
          "wallet.userType": "vendor",
          "wallet.userId": vendorObjectId,
        },
      },
      { $match: { type: { $in: ["credit", "debit"] } } },
      {
        $group: {
          _id: { date: dateFormat, type: "$type" },
          total: { $sum: "$amount" },
        },
      },
      {
        $group: {
          _id: "$_id.date",
          credits: {
            $sum: { $cond: [{ $eq: ["$_id.type", "credit"] }, "$total", 0] },
          },
          debits: {
            $sum: { $cond: [{ $eq: ["$_id.type", "debit"] }, "$total", 0] },
          },
        },
      },
      ...(period === "weekly"
        ? [
            {
              $project: {
                _id: 0,
                isoWeekYear: "$_id.isoWeekYear",
                isoWeek: "$_id.isoWeek",
                adminCommission: { $multiply: ["$credits", 0.1] },
                vendorShare: { $multiply: ["$credits", 0.9] },
                revenue: "$credits",
              },
            },
            {
              $addFields: {
                date: {
                  $concat: [
                    { $toString: "$isoWeekYear" },
                    "-W",
                    {
                      $cond: [
                        { $lt: ["$isoWeek", 10] },
                        { $concat: ["0", { $toString: "$isoWeek" }] },
                        { $toString: "$isoWeek" },
                      ],
                    },
                  ],
                },
              },
            },
            { $project: { isoWeekYear: 0, isoWeek: 0 } },
          ]
        : [
            {
              $project: {
                _id: 0,
                year: "$_id.year",
                month: "$_id.month",
                day: "$_id.day",
                adminCommission: { $multiply: ["$credits", 0.1] },
                vendorShare: { $multiply: ["$credits", 0.9] },
                revenue: "$credits",
              },
            },
            {
              $addFields: {
                date: {
                  $dateToString: {
                    format:
                      period === "daily"
                        ? "%Y-%m-%d"
                        : period === "monthly"
                        ? "%Y-%m"
                        : "%Y",
                    date: {
                      $dateFromParts:
                        period === "daily"
                          ? { year: "$year", month: "$month", day: "$day" }
                          : period === "monthly"
                          ? { year: "$year", month: "$month" }
                          : { year: "$year" },
                    },
                  },
                },
              },
            },
            { $project: { year: 0, month: 0, day: 0 } },
          ]),
      { $sort: { date: 1 } },
    ];

    return await walletTransactionsDB.aggregate(pipeline);
  }

  async getVendorProfitVsCommissionByTrip(
    vendorId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<
    Array<{
      tripId: string;
      tripName: string;
      vendorShare: number;
      adminCommission: number;
    }>
  > {
    const matchStage: FilterQuery<IWalletTransactionsModel> = {};
    if (startDate || endDate) {
      matchStage.createdAt = {};
      if (startDate) matchStage.createdAt.$gte = startDate;
      if (endDate) matchStage.createdAt.$lte = endDate;
    }

    const vendorObjectId = new mongoose.Types.ObjectId(vendorId);

    const pipeline: PipelineStage[] = [
      { $match: matchStage },
      {
        $lookup: {
          from: "wallets",
          localField: "walletId",
          foreignField: "_id",
          as: "wallet",
        },
      },
      { $unwind: "$wallet" },
      {
        $match: {
          "wallet.userType": "vendor",
          "wallet.userId": vendorObjectId,
        },
      },
      { $match: { type: { $in: ["credit", "debit"] } } },
      {
        $group: {
          _id: "$referenceId", // bookingId
          creditSum: {
            $sum: { $cond: [{ $eq: ["$type", "credit"] }, "$amount", 0] },
          },
          debitSum: {
            $sum: { $cond: [{ $eq: ["$type", "debit"] }, "$amount", 0] },
          },
        },
      },
      {
        $lookup: {
          from: "bookings",
          localField: "_id",
          foreignField: "bookingId",
          as: "booking",
        },
      },
      { $unwind: "$booking" },
      {
        $lookup: {
          from: "packages",
          localField: "booking.packageId",
          foreignField: "packageId",
          as: "pkg",
        },
      },
      { $unwind: "$pkg" },
      { $match: { "pkg.agencyId": vendorObjectId } },
      {
        $project: {
          _id: 0,
          tripId: "$pkg.packageId",
          tripName: "$pkg.packageName",
          vendorShare: { $subtract: ["$creditSum", "$debitSum"] },
          adminCommission: {
            $multiply: [
              { $subtract: ["$creditSum", "$debitSum"] },
              0.1111111111,
            ],
          },
        },
      },
      {
        $group: {
          _id: "$tripId",
          tripName: { $first: "$tripName" },
          vendorShare: { $sum: "$vendorShare" },
          adminCommission: { $sum: "$adminCommission" },
        },
      },
      {
        $project: {
          _id: 0,
          tripId: "$_id",
          tripName: 1,
          vendorShare: 1,
          adminCommission: 1,
        },
      },
      { $sort: { vendorShare: -1 } },
    ];

    const result = await walletTransactionsDB.aggregate(pipeline);
    return result;
  }

  async getVendorPaymentModeDistribution(
    vendorId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<Array<{ mode: string; amount: number }>> {
    const matchStage: FilterQuery<IWalletTransactionsModel> = {};
    if (startDate || endDate) {
      matchStage.createdAt = {};
      if (startDate) matchStage.createdAt.$gte = startDate;
      if (endDate) matchStage.createdAt.$lte = endDate;
    }
    const vendorObjectId = new mongoose.Types.ObjectId(vendorId);
    const pipeline: PipelineStage[] = [
      { $match: matchStage },
      {
        $lookup: {
          from: "wallets",
          localField: "walletId",
          foreignField: "_id",
          as: "wallet",
        },
      },
      { $unwind: "$wallet" },
      {
        $match: {
          "wallet.userType": "vendor",
          "wallet.userId": vendorObjectId,
        },
      },
      { $group: { _id: "$type", amount: { $sum: "$amount" } } },
      {
        $project: {
          _id: 0,
          mode: { $cond: [{ $eq: ["$_id", "credit"] }, "credits", "refunds"] },
          amount: 1,
        },
      },
    ];

    // Correct projection for mode label
    const result = await walletTransactionsDB.aggregate(pipeline);
    return result.map((r) => ({
      mode: r.mode ?? (r._id === "credit" ? "credits" : "refunds"),
      amount: r.amount,
    }));
  }
}
