import { IBookingModel } from "../../../frameworks/database/models/booking.model";
import { BOOKINGSTATUS, BookingStatus } from "../../../shared/constants";
import { BookingListWithPackageDetailsDto, BookingListWithUserDetailsDto, PaginatedBookingListWithUserDetails } from "../../../shared/dto/bookingDto";
import { IBookingEntity } from "../../modelsEntity/booking.entity";

export interface IBookingRepository {
  createBooking(data: Partial<IBookingEntity>): Promise<IBookingEntity>;
  findByBookingId(id: string): Promise<IBookingModel | null>;
  findByUserId(userId: string): Promise<IBookingEntity | null>;
  updateBooking(userId  :string,data : Partial<IBookingEntity>) : Promise<void>;
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
    searchTerm : string,
    status : BOOKINGSTATUS,
    pageNumber : number,
    pageSize : number
  ): Promise<PaginatedBookingListWithUserDetails>;
  getAllBookingsByUserId(userId: string): Promise<IBookingEntity[] | []>;
  countByPackageIdAndStatus(
    packageId: string,
    status: string[]
  ): Promise<number>;
  getAllConfirmedBookingsByUserIdWithPackageDetails(
    userId: string,
    status: BookingStatus
  ): Promise<IBookingEntity[] | []>;
}
