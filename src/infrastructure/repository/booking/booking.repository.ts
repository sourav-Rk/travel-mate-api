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
    console.log(result);
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

    console.log(bookings);

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
}
