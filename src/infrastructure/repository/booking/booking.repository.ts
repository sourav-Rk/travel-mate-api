import mongoose, { FilterQuery, PipelineStage } from "mongoose";
import { injectable } from "tsyringe";

import {
  BookingDetailsWithUserDetailsDto,
  BookingListWithPackageDetailsDto,
  BookingListWithUserDetailsDto,
  CancelledBookingDetailsWithUserAndPackageDetailsDto,
  FindCancellationRequestsDto,
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
import { BookingMapper } from "../../../application/mapper/booking.mapper";
import { IBookingEntity } from "../../../domain/entities/booking.entity";
import { IPackageEntity } from "../../../domain/entities/package.entity";
import { IBookingRepository } from "../../../domain/repositoryInterfaces/booking/booking-repository.interface";
import { BOOKINGSTATUS, BookingStatus } from "../../../shared/constants";
import { bookingDB, IBookingModel } from "../../database/models/booking.model";
import { BaseRepository } from "../baseRepository";

@injectable()
export class BookingRepository
  extends BaseRepository<IBookingModel, IBookingEntity>
  implements IBookingRepository
{
  async createBooking(data: Partial<IBookingEntity>): Promise<IBookingEntity> {
    const modelData = await bookingDB.create(data);
    return BookingMapper.toEntity(modelData);
  }

  async findByCustomBookingId(
    bookingId: string
  ): Promise<IBookingEntity | null> {
    return bookingDB.findOne({ bookingId });
  }

  async findByBookingId(id: string): Promise<IBookingModel | null> {
    return await bookingDB.findById(id);
  }

  async findByUserId(userId: string): Promise<IBookingEntity | null> {
    return await bookingDB.findOne({ userId });
  }

  async updateBooking(
    bookingId: string,
    data: Partial<IBookingEntity>
  ): Promise<void> {
    await bookingDB.updateOne({ _id: bookingId }, { $set: data });
  }

  async findByPackageIdAndUserId(
    userId: string,
    packageId: string
  ): Promise<IBookingEntity | null> {
    return await bookingDB.findOne({ userId, packageId });
  }

  async findByPackageId(packageId: string): Promise<IBookingEntity[] | []> {
    const modelData = await bookingDB.find({ packageId });
    const bookings = modelData.map((doc) => BookingMapper.toEntity(doc));
    return bookings;
  }

  async getAllBookingsByUserId(userId: string): Promise<IBookingEntity[] | []> {
    return await bookingDB.find({ userId });
  }

  async getAllConfirmedBookingsByUserIdWithPackageDetails(
    userId: string,
    status: BookingStatus
  ): Promise<IBookingWithPackage[] | []> {
    return await bookingDB
      .find({ userId, status })
      .populate({
        path: "packageId",
        model: "packages",
        localField: "packageId",
        foreignField: "packageId",
        justOne: true,
      })
      .lean<IBookingWithPackage[]>();
  }

  async countByPackageIdAndStatus(
    packageId: string,
    status: string[]
  ): Promise<number> {
    return await bookingDB.countDocuments({ packageId, status });
  }

  async getBookingsByUserIdAndStatus(
    userId: string,
    statuses: BOOKINGSTATUS[]
  ): Promise<BookingListWithPackageDetailsDto[] | []> {
    const modelData = await bookingDB
      .find({ userId, status: { $in: statuses } })
      .populate<{ packageId: IPackageEntity }>({
        path: "packageId",
        model: "packages",
        localField: "packageId", // in booking
        foreignField: "packageId", // in package
        justOne: true,
      })
      .lean<IBookingEntity[]>();

    return modelData as unknown as BookingListWithPackageDetailsDto[];
  }

  async findByPackageIdWithUserDetails(
    packageId: string,
    searchTerm: string,
    status: string,
    pageNumber: number,
    pageSize: number
  ): Promise<PaginatedBookingListWithUserDetails> {
    const filter: FilterQuery<IBookingModel> = { packageId };

    if (status && status !== "all") {
      filter.status = status;
    }

    const skip = (pageNumber - 1) * pageSize;
    const limit = pageSize;

    const pipeline: PipelineStage[] = [
      { $match: filter },
      {
        $lookup: {
          from: "clients",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
    ];

    if (searchTerm) {
      pipeline.push({
        $match: {
          $or: [
            { bookingId: { $regex: searchTerm, $options: "i" } },
            { "user.firstName": { $regex: searchTerm, $options: "i" } },
            { "user.lastName": { $regex: searchTerm, $options: "i" } },
            { "user.email": { $regex: searchTerm, $options: "i" } },
            { "user.phone": { $regex: searchTerm, $options: "i" } },
          ],
        },
      });
    }

    pipeline.push({ $sort: { createdAt: -1 } });

    const countPipeline = [...pipeline, { $count: "total" }];
    const totalResult = await bookingDB.aggregate(countPipeline);
    const total = totalResult.length > 0 ? totalResult[0].total : 0;

    // Add pagination
    pipeline.push({ $skip: skip }, { $limit: limit });

    const bookings = await bookingDB.aggregate(pipeline);

    return {
      bookings: bookings as unknown as BookingListWithUserDetailsDto[],
      total,
    };
  }

  async findByBookingIdWithUserDetails(
    bookingId: string
  ): Promise<BookingDetailsWithUserDetailsDto | null> {
    const pipeline = [
      {
        $match: {
          _id: new mongoose.Types.ObjectId(bookingId),
        },
      },
      {
        $lookup: {
          from: "clients",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          bookingId: 1,
          packageId: 1,
          status: 1,
          isWaitlisted: 1,
          cancelledAt: 1,
          advancePayment: 1,
          fullPayment: 1,
          createdAt: 1,
          updatedAt: 1,
          user: {
            _id: "$user._id",
            firstName: "$user.firstName",
            lastName: "$user.lastName",
            email: "$user.email",
            phone: "$user.phone",
            gender: "$user.gender",
          },
        },
      },
    ];

    const result = await bookingDB.aggregate(pipeline);

    return result.length > 0
      ? (result[0] as BookingDetailsWithUserDetailsDto)
      : null;
  }

  async findCancelledBookingIdWithUserDetails(
    bookingId: string
  ): Promise<CancelledBookingDetailsWithUserAndPackageDetailsDto | null> {
    const pipeline = [
      {
        $match: {
          bookingId,
        },
      },
      {
        $lookup: {
          from: "clients",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "packages",
          localField: "packageId",
          foreignField: "packageId",
          as: "package",
        },
      },
      {
        $unwind: { path: "$package", preserveNullAndEmptyArrays: true },
      },
      {
        $project: {
          _id: 1,
          bookingId: 1,
          packageId: 1,
          status: 1,
          isWaitlisted: 1,
          cancelledAt: 1,
          advancePayment: 1,
          fullPayment: 1,
          cancellationRequest: 1,
          createdAt: 1,
          updatedAt: 1,
          user: {
            _id: "$user._id",
            firstName: "$user.firstName",
            lastName: "$user.lastName",
            email: "$user.email",
            phone: "$user.phone",
            gender: "$user.gender",
          },
          package: {
            packageId: "$package.packageId",
            packageName: "$package.packageName",
            title: "$package.title",
            startDate: "$package.startDate",
            endDate: "$package.endDate",
            price: "$package.price",
            status: "$package.status",
          },
        },
      },
    ];

    const result = await bookingDB.aggregate(pipeline);

    return result.length > 0
      ? (result[0] as CancelledBookingDetailsWithUserAndPackageDetailsDto)
      : null;
  }

  async findCancellationRequests(
    packageIds: string[],
    page: number,
    limit: number,
    searchTerm?: string,
    status?: "cancellation_requested" | "cancelled"
  ): Promise<PaginatedCancellationRequests> {
    if (!packageIds || packageIds.length === 0) {
      return { bookings: [], total: 0 };
    }
    const skip = (page - 1) * limit;
    const matchConditions: FilterQuery<IBookingModel> = {
      packageId: { $in: packageIds },
    };

    if (status === "cancelled") {
      matchConditions.status = BOOKINGSTATUS.CANCELLED;
    } else {
      matchConditions.status = BOOKINGSTATUS.CANCELLATION_REQUESTED;
    }

    if (searchTerm) {
      matchConditions.$or = [
        { bookingId: { $regex: searchTerm, $options: "i" } },
        { "user.name": { $regex: searchTerm, $options: "i" } },
        { "user.email": { $regex: searchTerm, $options: "i" } },
      ];
    }

    const [result] = await bookingDB.aggregate([
      {
        $facet: {
          bookings: [
            {
              $match: matchConditions,
            },
            {
              $lookup: {
                from: "packages",
                localField: "packageId",
                foreignField: "packageId",
                as: "package",
              },
            },
            { $unwind: { path: "$package", preserveNullAndEmptyArrays: true } },
            {
              $lookup: {
                from: "clients",
                localField: "userId",
                foreignField: "_id",
                as: "user",
              },
            },
            { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
          ],
          total: [
            {
              $match: matchConditions,
            },
            { $count: "count" },
          ],
        },
      },
    ]);

    const bookings = result?.bookings || [];
    const total = result?.total?.[0]?.count || 0;

    const data = bookings.map((bkg: FindCancellationRequestsDto) =>
      BookingMapper.mapToCancellationRequestsDto(bkg)
    );

    return {
      bookings: data,
      total,
    };
  }

  async findByPackageIdAndStatus(
    packageId: string,
    status: BOOKINGSTATUS
  ): Promise<IBookingEntity[] | []> {
    return await bookingDB.find({ packageId, status });
  }

  async getTotalSalesCount(startDate?: Date, endDate?: Date): Promise<number> {
    const filter: FilterQuery<IBookingModel> = {
      status: {
        $in: [
          BOOKINGSTATUS.CONFIRMED,
          BOOKINGSTATUS.FULLY_PAID,
          BOOKINGSTATUS.COMPLETED,
        ],
      },
    };

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = startDate;
      if (endDate) filter.createdAt.$lte = endDate;
    }

    return await bookingDB.countDocuments(filter);
  }

  async getUniqueTravellersCount(
    startDate?: Date,
    endDate?: Date
  ): Promise<number> {
    const match: FilterQuery<IBookingModel> = {};

    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate) match.createdAt.$gte = startDate;
      if (endDate) match.createdAt.$lte = endDate;
    }

    const pipeline: PipelineStage[] = [
      { $match: match },
      {
        $group: {
          _id: "$userId",
        },
      },
      {
        $count: "total",
      },
    ];

    const result = await bookingDB.aggregate(pipeline);
    return result.length > 0 ? result[0].total : 0;
  }

  async getBookingStatusDistribution(
    startDate?: Date,
    endDate?: Date
  ): Promise<Record<string, number>> {
    const match: FilterQuery<IBookingModel> = {};

    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate) match.createdAt.$gte = startDate;
      if (endDate) match.createdAt.$lte = endDate;
    }

    const pipeline: PipelineStage[] = [
      { $match: match },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ];

    const result = await bookingDB.aggregate(pipeline);
    const distribution: Record<string, number> = {};

    Object.values(BOOKINGSTATUS).forEach((status) => {
      distribution[status] = 0;
    });

    result.forEach((item) => {
      distribution[item._id] = item.count;
    });

    return distribution;
  }

  async getRevenueByCategory(
    startDate?: Date,
    endDate?: Date
  ): Promise<Array<{ category: string; revenue: number; bookings: number }>> {
    const match: FilterQuery<IBookingModel> = {
      status: {
        $in: [
          BOOKINGSTATUS.CONFIRMED,
          BOOKINGSTATUS.FULLY_PAID,
          BOOKINGSTATUS.COMPLETED,
        ],
      },
    };

    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate) match.createdAt.$gte = startDate;
      if (endDate) match.createdAt.$lte = endDate;
    }

    const pipeline: PipelineStage[] = [
      { $match: match },
      {
        $lookup: {
          from: "packages",
          localField: "packageId",
          foreignField: "packageId",
          as: "package",
        },
      },
      {
        $unwind: {
          path: "$package",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$package.category",
          revenue: {
            $sum: {
              $add: [
                { $ifNull: ["$advancePayment.amount", 0] },
                { $ifNull: ["$fullPayment.amount", 0] },
              ],
            },
          },
          bookings: { $sum: 1 },
        },
      },
      {
        $project: {
          category: { $ifNull: ["$_id", "Unknown"] },
          revenue: 1,
          bookings: 1,
        },
      },
    ];

    return await bookingDB.aggregate(pipeline);
  }

  async getVendorTotalBookingsCount(
    vendorId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<number> {
    const match: FilterQuery<IBookingModel> = {};

    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate) match.createdAt.$gte = startDate;
      if (endDate) match.createdAt.$lte = endDate;
    }
    const vendorObjectId = new mongoose.Types.ObjectId(vendorId);

    const pipeline: PipelineStage[] = [
      { $match: match },
      {
        $lookup: {
          from: "packages",
          localField: "packageId",
          foreignField: "packageId",
          as: "pkg",
        },
      },
      { $unwind: "$pkg" },
      { $match: { "pkg.agencyId": vendorObjectId } },
      { $count: "total" },
    ];

    const result = await bookingDB.aggregate(pipeline);
    return result[0]?.total || 0;
  }

  async getVendorUniqueTravellersCount(
    vendorId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<number> {
    const vendorObjectId = new mongoose.Types.ObjectId(vendorId);
    const match: FilterQuery<IBookingModel> = {};
    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate) match.createdAt.$gte = startDate;
      if (endDate) match.createdAt.$lte = endDate;
    }

    const pipeline: PipelineStage[] = [
      { $match: match },
      {
        $lookup: {
          from: "packages",
          localField: "packageId",
          foreignField: "packageId",
          as: "pkg",
        },
      },
      { $unwind: "$pkg" },
      { $match: { "pkg.agencyId": vendorObjectId } },
      { $group: { _id: "$userId" } },
      { $count: "total" },
    ];

    const result = await bookingDB.aggregate(pipeline);

    return result[0]?.total || 0;
  }

  async getVendorBookingStatusDistribution(
    vendorId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<Record<string, number>> {
    const match: FilterQuery<IBookingModel> = {};
    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate) match.createdAt.$gte = startDate;
      if (endDate) match.createdAt.$lte = endDate;
    }

    const vendorObjectId = new mongoose.Types.ObjectId(vendorId);

    const pipeline: PipelineStage[] = [
      { $match: match },
      {
        $lookup: {
          from: "packages",
          localField: "packageId",
          foreignField: "packageId",
          as: "pkg",
        },
      },
      { $unwind: "$pkg" },
      { $match: { "pkg.agencyId": vendorObjectId } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ];

    const result = await bookingDB.aggregate(pipeline);
    const distribution: Record<string, number> = {} as Record<
      keyof typeof BOOKINGSTATUS,
      number
    >;
    Object.values(BOOKINGSTATUS).forEach((s) => (distribution[s] = 0));
    result.forEach((r) => (distribution[r._id] = r.count));

    return distribution;
  }

  async getVendorRevenueByPackage(
    vendorId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<
    Array<{ packageId: string; packageName: string; revenue: number }>
  > {
    const match: FilterQuery<IBookingModel> = {};
    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate) match.createdAt.$gte = startDate;
      if (endDate) match.createdAt.$lte = endDate;
    }
    const vendorObjectId = new mongoose.Types.ObjectId(vendorId);
    const pipeline: PipelineStage[] = [
      { $match: match },
      {
        $lookup: {
          from: "packages",
          localField: "packageId",
          foreignField: "packageId",
          as: "pkg",
        },
      },
      { $unwind: "$pkg" },
      { $match: { "pkg.agencyId": vendorObjectId } },
      {
        $addFields: {
          totalPaid: {
            $add: [
              { $cond: ["$advancePayment.paid", "$advancePayment.amount", 0] },
              { $cond: ["$fullPayment.paid", "$fullPayment.amount", 0] },
            ],
          },
        },
      },
      {
        $group: {
          _id: "$packageId",
          packageName: { $first: "$pkg.packageName" },
          revenue: { $sum: "$totalPaid" },
        },
      },
      {
        $project: {
          _id: 0,
          packageId: "$_id",
          packageName: 1,
          revenue: 1,
        },
      },
      { $sort: { revenue: -1 } },
    ];

    return await bookingDB.aggregate(pipeline);
  }

  async getVendorTopPackagesByRevenue(
    vendorId: string,
    limit: number,
    startDate?: Date,
    endDate?: Date
  ): Promise<
    Array<{
      packageId: string;
      packageName: string;
      revenue: number;
      bookings: number;
    }>
  > {
    const match: FilterQuery<IBookingModel> = {};
    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate) match.createdAt.$gte = startDate;
      if (endDate) match.createdAt.$lte = endDate;
    }

    const vendorObjectId = new mongoose.Types.ObjectId(vendorId);

    const pipeline: PipelineStage[] = [
      { $match: match },
      {
        $lookup: {
          from: "packages",
          localField: "packageId",
          foreignField: "packageId",
          as: "pkg",
        },
      },
      { $unwind: "$pkg" },
      { $match: { "pkg.agencyId": vendorObjectId } },
      {
        $addFields: {
          totalPaid: {
            $add: [
              { $cond: ["$advancePayment.paid", "$advancePayment.amount", 0] },
              { $cond: ["$fullPayment.paid", "$fullPayment.amount", 0] },
            ],
          },
        },
      },
      {
        $group: {
          _id: "$packageId",
          packageName: { $first: "$pkg.packageName" },
          revenue: { $sum: "$totalPaid" },
          bookings: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          packageId: "$_id",
          packageName: 1,
          revenue: 1,
          bookings: 1,
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: limit },
    ];

    return await bookingDB.aggregate(pipeline);
  }

  async getVendorRecentBookings(
    vendorId: string,
    limit: number
  ): Promise<
    Array<{
      bookingId: string;
      travelerName: string;
      tripName: string;
      amount: number;
      date: Date;
      status: string;
    }>
  > {
    const vendorObjectId = new mongoose.Types.ObjectId(vendorId);
    const pipeline: PipelineStage[] = [
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: "packages",
          localField: "packageId",
          foreignField: "packageId",
          as: "pkg",
        },
      },
      { $unwind: "$pkg" },
      { $match: { "pkg.agencyId": vendorObjectId } },
      {
        $lookup: {
          from: "clients",
          localField: "userId",
          foreignField: "_id",
          as: "client",
        },
      },
      { $unwind: "$client" },
      {
        $addFields: {
          totalPaid: {
            $add: [
              { $cond: ["$advancePayment.paid", "$advancePayment.amount", 0] },
              { $cond: ["$fullPayment.paid", "$fullPayment.amount", 0] },
            ],
          },
        },
      },
      {
        $project: {
          _id: 0,
          bookingId: "$bookingId",
          travelerName: {
            $concat: ["$client.firstName", " ", "$client.lastName"],
          },
          tripName: "$pkg.packageName",
          amount: "$totalPaid",
          date: "$createdAt",
          status: "$status",
        },
      },
      { $limit: limit },
    ];

    return await bookingDB.aggregate(pipeline);
  }

  async getTopPackagesByRevenue(
    limit: number,
    startDate?: Date,
    endDate?: Date
  ): Promise<
    Array<{
      packageId: string;
      packageName: string;
      revenue: number;
      bookings: number;
    }>
  > {
    const match: FilterQuery<IBookingModel> = {
      status: {
        $in: [
          BOOKINGSTATUS.CONFIRMED,
          BOOKINGSTATUS.FULLY_PAID,
          BOOKINGSTATUS.COMPLETED,
        ],
      },
    };

    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate) match.createdAt.$gte = startDate;
      if (endDate) match.createdAt.$lte = endDate;
    }

    const pipeline: PipelineStage[] = [
      { $match: match },
      {
        $group: {
          _id: "$packageId",
          revenue: {
            $sum: {
              $add: [
                { $ifNull: ["$advancePayment.amount", 0] },
                { $ifNull: ["$fullPayment.amount", 0] },
              ],
            },
          },
          bookings: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "packages",
          localField: "_id",
          foreignField: "packageId",
          as: "package",
        },
      },
      { $unwind: { path: "$package", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          packageId: { $ifNull: ["$package.packageId", "$_id"] },
          packageName: { $ifNull: ["$package.packageName", "Unknown"] },
          revenue: 1,
          bookings: 1,
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: limit },
    ];

    return await bookingDB.aggregate(pipeline);
  }

  async getVendorDetailedRevenueByPackage(
    vendorId: string,
    startDate?: Date,
    endDate?: Date,
    packageId?: string,
    bookingStatus?: BOOKINGSTATUS
  ): Promise<
    Array<{
      packageId: string;
      packageName: string;
      totalBookings: number;
      totalRevenue: number;
      vendorShare: number;
      adminCommission: number;
      totalRefunds: number;
      travellersCount: number;
    }>
  > {
    const vendorObjectId = new mongoose.Types.ObjectId(vendorId);

    const match: FilterQuery<IBookingModel> = {};
    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate) match.createdAt.$gte = startDate;
      if (endDate) match.createdAt.$lte = endDate;
    }
    if (packageId) {
      match.packageId = packageId;
    }
    if (bookingStatus) {
      match.status = bookingStatus;
    }

    const pipeline: PipelineStage[] = [
      { $match: match },
      {
        $lookup: {
          from: "packages",
          localField: "packageId",
          foreignField: "packageId",
          as: "pkg",
        },
      },
      { $unwind: "$pkg" },
      { $match: { "pkg.agencyId": vendorObjectId } },
      {
        $addFields: {
          totalPaid: {
            $add: [
              { $cond: ["$advancePayment.paid", "$advancePayment.amount", 0] },
              { $cond: ["$fullPayment.paid", "$fullPayment.amount", 0] },
            ],
          },
          refundAmount: { $ifNull: ["$refundAmount", 0] },
        },
      },
      {
        $group: {
          _id: "$packageId",
          packageName: { $first: "$pkg.packageName" },
          totalBookings: { $sum: 1 },
          totalRevenue: { $sum: "$totalPaid" },
          totalRefunds: { $sum: "$refundAmount" },
          travellersCount: { $addToSet: "$userId" },
        },
      },
      {
        $project: {
          _id: 0,
          packageId: "$_id",
          packageName: 1,
          totalBookings: 1,
          totalRevenue: 1,
          vendorShare: { $multiply: ["$totalRevenue", 0.9] },
          adminCommission: { $multiply: ["$totalRevenue", 0.1] },
          totalRefunds: 1,
          travellersCount: { $size: "$travellersCount" },
        },
      },
      { $sort: { totalRevenue: -1 } },
    ];

    const result = await bookingDB.aggregate(pipeline);
    return result;
  }

  async getVendorRecentBookingsWithFilters(
    vendorId: string,
    limit: number,
    startDate?: Date,
    endDate?: Date,
    packageId?: string,
    bookingStatus?: BOOKINGSTATUS
  ): Promise<
    Array<{
      bookingId: string;
      travelerName: string;
      tripName: string;
      amount: number;
      date: Date;
      status: string;
    }>
  > {
    const vendorObjectId = new mongoose.Types.ObjectId(vendorId);

    const match: FilterQuery<IBookingModel> = {};
    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate) match.createdAt.$gte = startDate;
      if (endDate) match.createdAt.$lte = endDate;
    }
    if (packageId) {
      match.packageId = packageId;
    }
    if (bookingStatus) {
      match.status = bookingStatus;
    }

    const pipeline: PipelineStage[] = [
      { $match: match },
      {
        $lookup: {
          from: "packages",
          localField: "packageId",
          foreignField: "packageId",
          as: "pkg",
        },
      },
      { $unwind: "$pkg" },
      { $match: { "pkg.agencyId": vendorObjectId } },
      {
        $lookup: {
          from: "clients",
          localField: "userId",
          foreignField: "_id",
          as: "client",
        },
      },
      { $unwind: "$client" },
      {
        $addFields: {
          totalPaid: {
            $add: [
              { $cond: ["$advancePayment.paid", "$advancePayment.amount", 0] },
              { $cond: ["$fullPayment.paid", "$fullPayment.amount", 0] },
            ],
          },
        },
      },
      {
        $project: {
          _id: 0,
          bookingId: "$bookingId",
          travelerName: {
            $concat: ["$client.firstName", " ", "$client.lastName"],
          },
          tripName: "$pkg.packageName",
          amount: "$totalPaid",
          date: "$createdAt",
          status: "$status",
        },
      },
      { $sort: { createdAt: -1 } },
      { $limit: limit },
    ];

    const result = await bookingDB.aggregate(pipeline);
    return result;
  }

  // -------- Admin Sales Report methods --------
  async getAdminSalesReportSummary(
    startDate?: Date,
    endDate?: Date,
    vendorId?: string,
    packageId?: string
  ): Promise<SalesReportSummaryDto> {
    const match: FilterQuery<IBookingModel> = {};
    
    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate) match.createdAt.$gte = startDate;
      if (endDate) match.createdAt.$lte = endDate;
    }

    if (packageId) {
      match.packageId = packageId;
    }

    const pipeline: PipelineStage[] = [
      { $match: match },
      {
        $lookup: {
          from: "packages",
          localField: "packageId",
          foreignField: "packageId",
          as: "package",
        },
      },
      { $unwind: { path: "$package", preserveNullAndEmptyArrays: true } },
    ];

    if (vendorId && mongoose.Types.ObjectId.isValid(vendorId)) {
      pipeline.push({
        $match: { "package.agencyId": new mongoose.Types.ObjectId(vendorId) },
      });
    } else if (vendorId && !mongoose.Types.ObjectId.isValid(vendorId)) {
      // Return empty summary if vendorId is invalid
      return {
        totalRevenue: 0,
        adminRevenue: 0,
        vendorRevenue: 0,
        totalBookings: 0,
        confirmedBookings: 0,
        completedBookings: 0,
        cancelledBookings: 0,
        totalRefunds: 0,
        totalTravellers: 0,
        totalVendors: 0,
        totalPackages: 0,
        avgBookingValue: 0,
        conversionRate: 0,
      };
    }

    pipeline.push(
      {
        $addFields: {
          totalPaid: {
            $add: [
              { $cond: ["$advancePayment.paid", "$advancePayment.amount", 0] },
              { $cond: ["$fullPayment.paid", "$fullPayment.amount", 0] },
            ],
          },
          refundAmount: { $ifNull: ["$refundAmount", 0] },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalPaid" },
          adminRevenue: { $sum: { $multiply: ["$totalPaid", 0.1] } },
          vendorRevenue: { $sum: { $multiply: ["$totalPaid", 0.9] } },
          totalBookings: { $sum: 1 },
          confirmedBookings: {
            $sum: { $cond: [{ $eq: ["$status", BOOKINGSTATUS.CONFIRMED] }, 1, 0] },
          },
          completedBookings: {
            $sum: { $cond: [{ $eq: ["$status", BOOKINGSTATUS.COMPLETED] }, 1, 0] },
          },
          cancelledBookings: {
            $sum: { $cond: [{ $eq: ["$status", BOOKINGSTATUS.CANCELLED] }, 1, 0] },
          },
          totalRefunds: { $sum: "$refundAmount" },
          uniqueTravellers: { $addToSet: "$userId" },
          uniqueVendors: { $addToSet: "$package.agencyId" },
          uniquePackages: { $addToSet: "$packageId" },
        },
      },
      {
        $project: {
          _id: 0,
          totalRevenue: { $ifNull: ["$totalRevenue", 0] },
          adminRevenue: { $ifNull: ["$adminRevenue", 0] },
          vendorRevenue: { $ifNull: ["$vendorRevenue", 0] },
          totalBookings: { $ifNull: ["$totalBookings", 0] },
          confirmedBookings: { $ifNull: ["$confirmedBookings", 0] },
          completedBookings: { $ifNull: ["$completedBookings", 0] },
          cancelledBookings: { $ifNull: ["$cancelledBookings", 0] },
          totalRefunds: { $ifNull: ["$totalRefunds", 0] },
          totalTravellers: { $size: { $ifNull: ["$uniqueTravellers", []] } },
          totalVendors: { $size: { $ifNull: ["$uniqueVendors", []] } },
          totalPackages: { $size: { $ifNull: ["$uniquePackages", []] } },
          avgBookingValue: {
            $cond: [
              { $eq: ["$totalBookings", 0] },
              0,
              { $divide: ["$totalRevenue", "$totalBookings"] },
            ],
          },
        },
      }
    );

    const result = await bookingDB.aggregate(pipeline);
    const summary = result[0] || {
      totalRevenue: 0,
      adminRevenue: 0,
      vendorRevenue: 0,
      totalBookings: 0,
      confirmedBookings: 0,
      completedBookings: 0,
      cancelledBookings: 0,
      totalRefunds: 0,
      totalTravellers: 0,
      totalVendors: 0,
      totalPackages: 0,
      avgBookingValue: 0,
    };

    // Calculate conversion rate (completed bookings / total bookings)
    const conversionRate =
      summary.totalBookings > 0
        ? (summary.completedBookings / summary.totalBookings) * 100
        : 0;

    return {
      ...summary,
      conversionRate: Math.round(conversionRate * 100) / 100,
    };
  }

  async getAdminVendorRevenueBreakdown(
    startDate?: Date,
    endDate?: Date,
    vendorId?: string
  ): Promise<VendorRevenueBreakdownDto[]> {
    const match: FilterQuery<IBookingModel> = {};
    
    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate) match.createdAt.$gte = startDate;
      if (endDate) match.createdAt.$lte = endDate;
    }

    // Validate vendorId if provided
    if (vendorId && !mongoose.Types.ObjectId.isValid(vendorId)) {
      return [];
    }

    const pipeline: PipelineStage[] = [
      { $match: match },
      {
        $lookup: {
          from: "packages",
          localField: "packageId",
          foreignField: "packageId",
          as: "package",
        },
      },
      { $unwind: { path: "$package", preserveNullAndEmptyArrays: true } },
      {
        $match: {
          "package.agencyId": { $exists: true, $ne: null },
        },
      },
    ];

    if (vendorId && mongoose.Types.ObjectId.isValid(vendorId)) {
      pipeline.push({
        $match: { "package.agencyId": new mongoose.Types.ObjectId(vendorId) },
      });
    }

    pipeline.push(
      {
        $addFields: {
          totalPaid: {
            $add: [
              { $cond: ["$advancePayment.paid", "$advancePayment.amount", 0] },
              { $cond: ["$fullPayment.paid", "$fullPayment.amount", 0] },
            ],
          },
          refundAmount: { $ifNull: ["$refundAmount", 0] },
        },
      },
      {
        $lookup: {
          from: "vendors",
          localField: "package.agencyId",
          foreignField: "_id",
          as: "vendor",
        },
      },
      { $unwind: { path: "$vendor", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: "$package.agencyId",
          vendorName: {
            $first: {
              $concat: ["$vendor.agencyName", " "],
            },
          },
          totalRevenue: { $sum: "$totalPaid" },
          totalBookings: { $sum: 1 },
          refundsIssued: { $sum: "$refundAmount" },
        },
      },
      {
        $project: {
          _id: 0,
          vendorId: { $toString: "$_id" },
          vendorName: { $ifNull: ["$vendorName", "Unknown Vendor"] },
          totalRevenue: 1,
          vendorShare: { $multiply: ["$totalRevenue", 0.9] },
          adminCommission: { $multiply: ["$totalRevenue", 0.1] },
          totalBookings: 1,
          refundsIssued: 1,
        },
      },
      { $sort: { totalRevenue: -1 } }
    );

    return await bookingDB.aggregate(pipeline);
  }

  async getAdminPackageRevenueBreakdown(
    startDate?: Date,
    endDate?: Date,
    vendorId?: string,
    packageId?: string
  ): Promise<PackageRevenueBreakdownDto[]> {
    const match: FilterQuery<IBookingModel> = {};
    
    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate) match.createdAt.$gte = startDate;
      if (endDate) match.createdAt.$lte = endDate;
    }

    if (packageId) {
      match.packageId = packageId;
    }

    // Validate vendorId if provided
    if (vendorId && !mongoose.Types.ObjectId.isValid(vendorId)) {
      return [];
    }

    const pipeline: PipelineStage[] = [
      { $match: match },
      {
        $lookup: {
          from: "packages",
          localField: "packageId",
          foreignField: "packageId",
          as: "package",
        },
      },
      { $unwind: { path: "$package", preserveNullAndEmptyArrays: true } },
    ];

    if (vendorId && mongoose.Types.ObjectId.isValid(vendorId)) {
      pipeline.push({
        $match: { "package.agencyId": new mongoose.Types.ObjectId(vendorId) },
      });
    }

    pipeline.push(
      {
        $addFields: {
          totalPaid: {
            $add: [
              { $cond: ["$advancePayment.paid", "$advancePayment.amount", 0] },
              { $cond: ["$fullPayment.paid", "$fullPayment.amount", 0] },
            ],
          },
          refundAmount: { $ifNull: ["$refundAmount", 0] },
        },
      },
      {
        $lookup: {
          from: "vendors",
          localField: "package.agencyId",
          foreignField: "_id",
          as: "vendor",
        },
      },
      { $unwind: { path: "$vendor", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: "$packageId",
          packageName: { $first: "$package.packageName" },
          vendorName: {
            $first: {
              $concat: ["$vendor.firstName", " ", "$vendor.lastName"],
            },
          },
          totalRevenue: { $sum: "$totalPaid" },
          totalBookings: { $sum: 1 },
          refunds: { $sum: "$refundAmount" },
        },
      },
      {
        $project: {
          _id: 0,
          packageId: "$_id",
          packageName: { $ifNull: ["$packageName", "Unknown Package"] },
          vendorName: { $ifNull: ["$vendorName", "Unknown Vendor"] },
          totalRevenue: 1,
          adminCommission: { $multiply: ["$totalRevenue", 0.1] },
          vendorShare: { $multiply: ["$totalRevenue", 0.9] },
          totalBookings: 1,
          refunds: 1,
        },
      },
      { $sort: { totalRevenue: -1 } }
    );

    return await bookingDB.aggregate(pipeline);
  }

  async getAdminRevenueTrend(
    period: "daily" | "weekly" | "monthly" | "yearly",
    startDate?: Date,
    endDate?: Date,
    vendorId?: string,
    packageId?: string
  ): Promise<RevenueTrendDataPointDto[]> {
    const match: FilterQuery<IBookingModel> = {};
    
    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate) match.createdAt.$gte = startDate;
      if (endDate) match.createdAt.$lte = endDate;
    }

    if (packageId) {
      match.packageId = packageId;
    }

    // Validate vendorId if provided
    if (vendorId && !mongoose.Types.ObjectId.isValid(vendorId)) {
      return [];
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
      { $match: match },
      {
        $lookup: {
          from: "packages",
          localField: "packageId",
          foreignField: "packageId",
          as: "package",
        },
      },
      { $unwind: { path: "$package", preserveNullAndEmptyArrays: true } },
    ];

    if (vendorId && mongoose.Types.ObjectId.isValid(vendorId)) {
      pipeline.push({
        $match: { "package.agencyId": new mongoose.Types.ObjectId(vendorId) },
      });
    }

    pipeline.push(
      {
        $addFields: {
          totalPaid: {
            $add: [
              { $cond: ["$advancePayment.paid", "$advancePayment.amount", 0] },
              { $cond: ["$fullPayment.paid", "$fullPayment.amount", 0] },
            ],
          },
        },
      },
      {
        $group: {
          _id: dateFormat,
          totalRevenue: { $sum: "$totalPaid" },
          adminRevenue: { $sum: { $multiply: ["$totalPaid", 0.1] } },
          vendorRevenue: { $sum: { $multiply: ["$totalPaid", 0.9] } },
          totalBookings: { $sum: 1 },
          minDate: { $min: "$createdAt" },
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
                totalRevenue: 1,
                adminRevenue: 1,
                vendorRevenue: 1,
                totalBookings: 1,
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
                totalRevenue: 1,
                adminRevenue: 1,
                vendorRevenue: 1,
                totalBookings: 1,
              },
            },
          ]),
      { $sort: { date: 1 } }
    );

    return await bookingDB.aggregate(pipeline);
  }

  async getAdminRecentTransactions(
    limit: number,
    startDate?: Date,
    endDate?: Date,
    vendorId?: string,
    packageId?: string
  ): Promise<RecentTransactionDto[]> {
    const match: FilterQuery<IBookingModel> = {};
    
    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate) match.createdAt.$gte = startDate;
      if (endDate) match.createdAt.$lte = endDate;
    }

    if (packageId) {
      match.packageId = packageId;
    }

    // Validate vendorId if provided
    if (vendorId && !mongoose.Types.ObjectId.isValid(vendorId)) {
      return [];
    }

    const pipeline: PipelineStage[] = [
      { $match: match },
      {
        $lookup: {
          from: "packages",
          localField: "packageId",
          foreignField: "packageId",
          as: "package",
        },
      },
      { $unwind: { path: "$package", preserveNullAndEmptyArrays: true } },
    ];

    if (vendorId && mongoose.Types.ObjectId.isValid(vendorId)) {
      pipeline.push({
        $match: { "package.agencyId": new mongoose.Types.ObjectId(vendorId) },
      });
    }

    pipeline.push(
      {
        $lookup: {
          from: "vendors",
          localField: "package.agencyId",
          foreignField: "_id",
          as: "vendor",
        },
      },
      { $unwind: { path: "$vendor", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "clients",
          localField: "userId",
          foreignField: "_id",
          as: "client",
        },
      },
      { $unwind: { path: "$client", preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          totalPaid: {
            $add: [
              { $cond: ["$advancePayment.paid", "$advancePayment.amount", 0] },
              { $cond: ["$fullPayment.paid", "$fullPayment.amount", 0] },
            ],
          },
          paymentMode: {
            $cond: [
              { $eq: ["$fullPayment.paid", true] },
              "full",
              {
                $cond: [
                  { $eq: ["$advancePayment.paid", true] },
                  "advance",
                  "pending",
                ],
              },
            ],
          },
        },
      },
      {
        $project: {
          _id: 0,
          bookingId: "$bookingId",
          packageName: { $ifNull: ["$package.packageName", "Unknown Package"] },
          vendorName: {
            $ifNull: [
              { $concat: ["$vendor.firstName", " ", "$vendor.lastName"] },
              "Unknown Vendor",
            ],
          },
          travelerName: {
            $ifNull: [
              { $concat: ["$client.firstName", " ", "$client.lastName"] },
              "Unknown Traveler",
            ],
          },
          amount: "$totalPaid",
          adminShare: { $multiply: ["$totalPaid", 0.1] },
          vendorShare: { $multiply: ["$totalPaid", 0.9] },
          bookingStatus: "$status",
          paymentMode: 1,
          date: "$createdAt",
        },
      },
      { $sort: { date: -1 } },
      { $limit: limit }
    );

    return await bookingDB.aggregate(pipeline);
  }

  async getAdminProfitVsCommission(
    startDate?: Date,
    endDate?: Date,
    vendorId?: string
  ): Promise<ProfitVsCommissionDto[]> {
    const match: FilterQuery<IBookingModel> = {};
    
    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate) match.createdAt.$gte = startDate;
      if (endDate) match.createdAt.$lte = endDate;
    }

    // Validate vendorId if provided
    if (vendorId && !mongoose.Types.ObjectId.isValid(vendorId)) {
      return [];
    }

    const pipeline: PipelineStage[] = [
      { $match: match },
      {
        $lookup: {
          from: "packages",
          localField: "packageId",
          foreignField: "packageId",
          as: "package",
        },
      },
      { $unwind: { path: "$package", preserveNullAndEmptyArrays: true } },
      {
        $match: {
          "package.agencyId": { $exists: true, $ne: null },
        },
      },
    ];

    if (vendorId && mongoose.Types.ObjectId.isValid(vendorId)) {
      pipeline.push({
        $match: { "package.agencyId": new mongoose.Types.ObjectId(vendorId) },
      });
    }

    pipeline.push(
      {
        $addFields: {
          totalPaid: {
            $add: [
              { $cond: ["$advancePayment.paid", "$advancePayment.amount", 0] },
              { $cond: ["$fullPayment.paid", "$fullPayment.amount", 0] },
            ],
          },
        },
      },
      {
        $lookup: {
          from: "vendors",
          localField: "package.agencyId",
          foreignField: "_id",
          as: "vendor",
        },
      },
      { $unwind: { path: "$vendor", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: "$package.agencyId",
          vendorName: {
            $first: {
              $concat: ["$vendor.firstName", " ", "$vendor.lastName"],
            },
          },
          adminCommission: { $sum: { $multiply: ["$totalPaid", 0.1] } },
          vendorEarnings: { $sum: { $multiply: ["$totalPaid", 0.9] } },
        },
      },
      {
        $project: {
          _id: 0,
          vendorId: { $toString: "$_id" },
          vendorName: { $ifNull: ["$vendorName", "Unknown Vendor"] },
          adminCommission: 1,
          vendorEarnings: 1,
          profitRatio: {
            $cond: [
              { $eq: ["$vendorEarnings", 0] },
              0,
              {
                $multiply: [
                  { $divide: ["$adminCommission", "$vendorEarnings"] },
                  100,
                ],
              },
            ],
          },
        },
      },
      { $sort: { adminCommission: -1 } }
    );

    return await bookingDB.aggregate(pipeline);
  }
}
