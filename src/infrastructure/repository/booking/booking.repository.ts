import { injectable } from "tsyringe";
import { IBookingRepository } from "../../../domain/repositoryInterfaces/booking/booking-repository.interface";
import { IBookingEntity } from "../../../domain/entities/booking.entity";
import { bookingDB, IBookingModel } from "../../database/models/booking.model";
import { BookingMapper } from "../../../application/mapper/booking.mapper";
import { BOOKINGSTATUS, BookingStatus } from "../../../shared/constants";
import { IPackageEntity } from "../../../domain/entities/package.entity";
import {
  BookingDetailsWithUserDetailsDto,
  BookingListWithPackageDetailsDto,
  BookingListWithUserDetailsDto,
  IBookingWithPackage,
  PaginatedBookingListWithUserDetails,
} from "../../../application/dto/response/bookingDto";
import { IClientEntity } from "../../../domain/entities/client.entity";
import { BaseRepository } from "../baseRepository";
import mongoose from "mongoose";

@injectable()
export class BookingRepository
  extends BaseRepository<IBookingModel, IBookingEntity>
  implements IBookingRepository
{
  async createBooking(data: Partial<IBookingEntity>): Promise<IBookingEntity> {
    const modelData = await bookingDB.create(data);
    return BookingMapper.toEntity(modelData);
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
    let filter: any = { packageId };
    // if (searchTerm) {
    //   filter.$or = [{ bookingId: { $regex: searchTerm, $options: "i" } }];
    // }

    if (status && status !== "all") {
      filter.status = status;
    }

    const skip = (pageNumber - 1) * pageSize;
    const limit = pageSize;

    const pipeline: any[] = [
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

    // const [bookings, total] = await Promise.all([
    //   bookingDB
    //     .find(filter)
    //     .populate<{ userId: IClientEntity }>("userId")
    //     .skip(skip)
    //     .limit(limit)
    //     .sort({ createdAt: -1 })
    //     .lean<IBookingEntity[]>(),
    //   bookingDB.countDocuments(filter),
    // ]);

    // console.log(filter);
    // return {
    //   bookings: bookings as unknown as BookingListWithUserDetailsDto[],
    //   total,
    // };
  }

  // async findByBookingIdWithUserDetails(
  //   bookingId: string
  // ): Promise<BookingDetailsWithUserDetailsDto | null> {
  //   return bookingDB
  //     .findById(bookingId)
  //     .populate("userId")
  //     .lean<BookingDetailsWithUserDetailsDto | null>();
  // }

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
}
