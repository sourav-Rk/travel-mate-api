import { injectable } from "tsyringe";
import { IBookingRepository } from "../../../entities/repositoryInterfaces/booking/booking-repository.interface";
import { IBookingEntity } from "../../../entities/modelsEntity/booking.entity";
import {
  bookingDB,
  IBookingModel,
} from "../../../frameworks/database/models/booking.model";
import { BookingMapper } from "../../mappers/booking.mapper";
import { BOOKINGSTATUS, BookingStatus } from "../../../shared/constants";
import { IPackageEntity } from "../../../entities/modelsEntity/package.entity";
import {
  BookingDetailsWithUserDetailsDto,
  BookingListWithPackageDetailsDto,
  BookingListWithUserDetailsDto,
  PaginatedBookingListWithUserDetails,
} from "../../../shared/dto/bookingDto";
import { IClientEntity } from "../../../entities/modelsEntity/client.entity";

@injectable()
export class BookingRepository implements IBookingRepository {
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
  ): Promise<IBookingEntity[] | []> {
    return await bookingDB
      .find({ userId, status })
      .populate<{ packageId: IPackageEntity }>("packageId")
      .lean<IBookingEntity[]>();
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
    if (searchTerm) {
      filter.$or = [{ bookingId: { $regex: searchTerm, $options: "i" } }];
    }

    if (status && status !== "all") {
      filter.status = status;
    }

    const skip = (pageNumber - 1) * pageSize;
    const limit = pageSize;

    const [bookings, total] = await Promise.all([
      bookingDB
        .find(filter)
        .populate<{ userId: IClientEntity }>("userId")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean<IBookingEntity[]>(),
      bookingDB.countDocuments(filter),
    ]);

    console.log(filter);
    return {
      bookings: bookings as unknown as BookingListWithUserDetailsDto[],
      total,
    };
  }

  async findByBookingIdWithUserDetails(
    bookingId: string
  ): Promise<BookingDetailsWithUserDetailsDto | null> {
    return bookingDB
      .findById(bookingId)
      .populate("userId")
      .lean<BookingDetailsWithUserDetailsDto | null>();
  }
}
