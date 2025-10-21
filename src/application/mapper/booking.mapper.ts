import { IBookingEntity } from "../../domain/entities/booking.entity";
import { IClientEntity } from "../../domain/entities/client.entity";
import { IPackageEntity } from "../../domain/entities/package.entity";
import { IBookingModel } from "../../infrastructure/database/models/booking.model";
import { BOOKINGSTATUS } from "../../shared/constants";
import {
  BookingDetailsDto,
  BookingDetailsWithUserDetailsDto,
  BookingListDTO,
  BookingListVendorDto,
  BookingListWithPackageDetailsDto,
  BookingListWithUserDetailsDto,
  CancellationRequestsList,
  CancelledBookingDetailsWithUserAndPackageDetailsDto,
  ClientPackageBookingDto,
  FindCancellationRequestsDto,
} from "../dto/response/bookingDto";

export class BookingMapper {
  static toEntity(doc: IBookingModel): IBookingEntity {
    return {
      _id: String(doc._id),
      bookingId: doc.bookingId,
      packageId: String(doc.packageId),
      userId: String(doc.userId),
      status: doc.status,
      isWaitlisted: doc.isWaitlisted,
      appliedAt: doc.appliedAt,
      cancelledAt: doc.cancelledAt,
      advancePayment: doc.advancePayment,
      fullPayment: doc.fullPayment,
      cancellationRequest: doc.cancellationRequest,
      refundAmount: doc.refundAmount,
    };
  }

  static mapToClientPackageBookingDto(
    doc: IBookingEntity
  ): ClientPackageBookingDto {
    const bookingDetail: ClientPackageBookingDto = {
      _id: String(doc._id),
      bookingId: doc.bookingId,
      status: doc.status,
      isWaitlisted: doc.isWaitlisted ?? false,
      packageId: doc.packageId,
    };
    if (doc?.cancelledAt) {
      bookingDetail.cancelledAt = doc.cancelledAt;
    }
    return bookingDetail;
  }

  static mapToBookingListWithPackageDetail(
    entity: BookingListWithPackageDetailsDto
  ): BookingListDTO {
    const bookingDetails = {
      id: String(entity._id),
      bookingId: entity.bookingId,
      userId: entity.userId.toString(),
      status: entity.status,
      isWaitlisted: entity.isWaitlisted ?? false,

      advancePayment: entity.advancePayment
        ? {
            amount: entity.advancePayment.amount,
            paid: entity.advancePayment.paid,
            dueDate: entity.advancePayment.dueDate,
            paidAt: entity.advancePayment.paidAt,
          }
        : { amount: 0, paid: false },

      fullPayment: entity.fullPayment
        ? {
            amount: entity.fullPayment.amount,
            paid: entity.fullPayment.paid,
            dueDate: entity.fullPayment.dueDate,
            paidAt: entity.fullPayment.paidAt,
          }
        : { amount: 0, paid: false },

      package: entity.packageId
        ? {
            id: String(entity.packageId._id),
            packageId: entity.packageId,
            images: entity.packageId.images[0] ?? undefined,
            name: entity.packageId.packageName,
            price: entity.packageId.price,
            startDate: entity.packageId.startDate,
            endDate: entity.packageId.endDate,
            duration: entity.packageId.duration ?? { days: 0, nights: 0 },
            meetingPoint: entity.packageId.meetingPoint,
          }
        : null,

      createdAt: entity.createdAt,
    };

    return bookingDetails;
  }

  static mapToVendorBookingListDto(
    doc: BookingListWithUserDetailsDto
  ): BookingListVendorDto {
    const bookingList: BookingListVendorDto = {
      _id: String(doc._id),
      bookingId: doc.bookingId!,
      status: doc.status as BOOKINGSTATUS,
      isWaitlisted: doc.isWaitlisted,
      user: doc.user
        ? {
            _id: String(doc.user._id),
            firstName: doc.user.firstName,
            lastName: doc.user.lastName,
            email: doc.user.email,
            phone: doc.user.phone ?? "",
          }
        : null,
      cancelledAt: doc.cancelledAt ?? null,
    };

    return bookingList;
  }

  static mapToGuideBookingListDto(
    doc: BookingListWithUserDetailsDto
  ): BookingListVendorDto {
    const bookingList: BookingListVendorDto = {
      _id: String(doc._id),
      bookingId: doc.bookingId!,
      status: doc.status as BOOKINGSTATUS,
      isWaitlisted: doc.isWaitlisted,
      user: doc.user
        ? {
            _id: String(doc.user._id),
            firstName: doc.user.firstName,
            lastName: doc.user.lastName,
            email: doc.user.email,
            phone: doc.user.phone ?? "",
          }
        : null,
      cancelledAt: doc.cancelledAt ?? null,
    };

    return bookingList;
  }

  static mapToBookingDetailsDto(doc: IBookingModel): BookingDetailsDto {
    return {
      _id: String(doc._id),
      bookingId: doc.bookingId,
      packageId: String(doc.packageId),
      userId: String(doc.userId),
      isWaitlisted: doc.isWaitlisted ?? false,
      status: doc.status,
      appliedAt : doc.appliedAt,
      cancelledAt : doc.cancelledAt,
      refundAmount : doc.refundAmount,
      advancePayment: doc.advancePayment
        ? {
            amount: doc.advancePayment.amount,
            dueDate: doc.advancePayment.dueDate,
            paid: doc.advancePayment.paid,
            paidAt: doc.advancePayment.paidAt,
          }
        : null,
      fullPayment: doc.fullPayment
        ? {
            amount: doc.fullPayment.amount,
            dueDate: doc.fullPayment.dueDate,
            paid: doc.fullPayment.paid,
            paidAt: doc.fullPayment.paidAt,
          }
        : null,
        cancellationRequest : doc.cancellationRequest ?{
          requestedAt : doc.cancellationRequest.requestedAt,
          reason : doc.cancellationRequest.reason,
          calculatedRefund : doc.cancellationRequest.calculatedRefund,
          approvedAt : doc.cancellationRequest.approvedAt
        } : null
    };
  }
  static mapToBookingDetailsWithUserDetailsDto(
    doc: BookingListWithUserDetailsDto
  ): BookingDetailsWithUserDetailsDto {
    return {
      _id: String(doc._id),
      bookingId: doc.bookingId!,
      packageId: String(doc.packageId),
      user: {
        _id: String(doc.user._id),
        firstName: doc.user.firstName,
        lastName: doc.user.lastName,
        gender: doc.user.gender!,
        phone: doc.user.phone!,
        email: doc.user.email,
      },
      isWaitlisted: doc.isWaitlisted ?? false,
      status: doc.status as BOOKINGSTATUS,
      advancePayment: doc.advancePayment
        ? {
            amount: doc.advancePayment.amount,
            dueDate: doc.advancePayment.dueDate!,
            paid: doc.advancePayment.paid!,
            paidAt: doc.advancePayment.paidAt!,
          }
        : null,
      fullPayment: doc.fullPayment
        ? {
            amount: doc.fullPayment.amount,
            dueDate: doc.fullPayment.dueDate!,
            paid: doc.fullPayment.paid!,
            paidAt: doc.fullPayment.paidAt!,
          }
        : null,
    };
  }

  static mapToCancellationRequestsDto(
    data: FindCancellationRequestsDto
  ): CancellationRequestsList {
    return {
      bookingId: data.bookingId,
      refundAmount: data.cancellationRequest?.calculatedRefund || 0,
      status: data.status,
      cancellationReason: data.cancellationRequest?.reason!,
      
      requestedAt: data.cancellationRequest?.requestedAt.toDateString()!,
      package: {
        packageId: data.package.packageId!,
        packageName: data.package.packageName,
        endDate: data.package.endDate,
        startDate: data.package.startDate,
        title: data.package.title,
      },
      user: {
        userId: String(data.userId),
        name: `${data.user.firstName} ${data.user.lastName}`,
        email: data.user.email,
        phone: data.user.phone!,
      },
    };
  }

  static mapToCancelledBookingWithUserAndPackageDetailsDto(
    booking: CancelledBookingDetailsWithUserAndPackageDetailsDto
  ): CancelledBookingDetailsWithUserAndPackageDetailsDto {
    return {
      _id: booking._id,
      bookingId: booking.bookingId,
      packageId : booking.packageId,
      status: booking.status,
      isWaitlisted: booking.isWaitlisted,
      cancelledAt: booking.cancelledAt,
      advancePayment: booking.advancePayment,
      fullPayment: booking.fullPayment,
      cancellationRequest: booking.cancellationRequest,
      user: booking.user
        ? {
            _id: String(booking.user._id),
            firstName: booking.user.firstName!,
            lastName: booking.user.lastName!,
            email: booking.user.email!,
            phone: booking.user.phone!,
            gender: booking.user.gender!,
          }
        : undefined,
      package: booking.package
        ? {
            packageId: booking.package.packageId,
            packageName: booking.package.packageName,
            title: booking.package.title,
            startDate: booking.package.startDate,
            endDate: booking.package.endDate,
            price: booking.package.price,
          }
        : undefined,
    };
  }
}
