import { IBookingModel } from "../../../infrastructure/database/models/booking.model";
import { BOOKINGSTATUS, BookingStatus } from "../../../shared/constants";
import {
  BookingDetailsWithUserDetailsDto,
  BookingListWithPackageDetailsDto,
  BookingListWithUserDetailsDto,
  IBookingWithPackage,
  PaginatedBookingListWithUserDetails,
} from "../../../application/dto/response/bookingDto";
import { IBookingEntity } from "../../entities/booking.entity";
import { IBaseRepository } from "../baseRepository.interface";

export interface IBookingRepository extends IBaseRepository<IBookingEntity> {
  createBooking(data: Partial<IBookingEntity>): Promise<IBookingEntity>;
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
}
