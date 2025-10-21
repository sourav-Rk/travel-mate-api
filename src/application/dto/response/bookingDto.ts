import { IBookingEntity } from "../../../domain/entities/booking.entity";
import { IClientEntity } from "../../../domain/entities/client.entity";
import { IPackageEntity } from "../../../domain/entities/package.entity";
import { BOOKINGSTATUS } from "../../../shared/constants";

//client package details dto
export interface ClientPackageBookingDto {
  _id: string;
  bookingId: string;
  packageId: string;
  status: BOOKINGSTATUS;
  isWaitlisted: boolean;
  cancelledAt?: Date;
}

// booking.dto.ts
export interface BookingListDTO {
  id: string;
  userId: string;
  status: string;
  isWaitlisted: boolean;
  advancePayment: {
    amount: number;
    paid: boolean;
    dueDate?: Date;
    paidAt?: Date;
  };
  fullPayment: {
    amount: number;
    paid: boolean;
    dueDate?: Date;
    paidAt?: Date;
  };
  package?: {
    id: string;
    images?: string;
    name: string;
    price: number;
    startDate: Date;
    endDate: Date;
    meetingPoint: string;
    duration: { days: number; nights: number };
  } | null;
  createdAt: Date;
}

//client booking list
export interface BookingListWithPackageDetailsDto {
  _id: string;
  bookingId: string;
  userId: string;
  status: string;
  isWaitlisted: boolean;
  advancePayment: {
    amount: number;
    paid: boolean;
    dueDate?: Date;
    paidAt?: Date;
  };
  fullPayment: {
    amount: number;
    paid: boolean;
    dueDate?: Date;
    paidAt?: Date;
  };
  packageId: IPackageEntity;
  createdAt: Date;
}

export interface IBookingWithPackage extends Omit<IBookingEntity, "packageId"> {
  packageId: IPackageEntity;
}

//booking list vendor dto
export interface BookingListVendorDto {
  _id: string;
  bookingId?: string;
  status: BOOKINGSTATUS;
  isWaitlisted: boolean;
  cancelledAt?: Date;
  user?: {
    _id: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
  } | null;
}

//vendor booking list dto
export interface BookingListWithUserDetailsDto {
  _id: string;
  bookingId?: string;
  user: IClientEntity;
  status: string;
  isWaitlisted: boolean;
  cancelledAt: Date;
  advancePayment: {
    amount: number;
    paid: boolean;
    dueDate?: Date;
    paidAt?: Date;
  };
  fullPayment: {
    amount: number;
    paid: boolean;
    dueDate?: Date;
    paidAt?: Date;
  };
  packageId: string;
  createdAt: Date;
}

//booking dto for viewing the booking details
export interface BookingDetailsDto {
  _id: string;
  userId: string;
  bookingId: string;
  packageId: string;
  status: BOOKINGSTATUS;
  isWaitlisted: boolean;
  appliedAt ?: Date;
  cancelledAt ?: Date;
  refundAmount ?: number;
  advancePayment?: {
    amount: number;
    paid: boolean;
    dueDate: Date;
    paidAt: Date | null;
  } | null;
  fullPayment?: {
    amount: number;
    paid: boolean;
    dueDate: Date | null;
    paidAt: Date | null;
  } | null;
  cancellationRequest?: {
    requestedAt : Date;
    reason : string;
    calculatedRefund?: number;
    approvedAt?:Date;
  }|null;
}

//booking details dto for booking details view
export interface BookingDetailsWithUserDetailsDto {
  _id: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    phone: string;
    gender: string;
    email: string;
  };
  bookingId: string;
  packageId: string;
  status: BOOKINGSTATUS;
  isWaitlisted: boolean;
  advancePayment?: {
    amount: number;
    paid: boolean;
    dueDate: Date;
    paidAt: Date | null;
  } | null;
  fullPayment?: {
    amount: number;
    paid: boolean;
    dueDate: Date | null;
    paidAt: Date | null;
  } | null;
}

//booking details dto for booking details view
export interface CancelledBookingDetailsWithUserAndPackageDetailsDto {
  _id: string;
  bookingId: string;
  packageId: string;
  status: BOOKINGSTATUS;
  isWaitlisted: boolean;
  cancelledAt?:Date;
  advancePayment?: {
    amount: number;
    paid: boolean;
    dueDate: Date;
    paidAt: Date | null;
  } | null;
  fullPayment?: {
    amount: number;
    paid: boolean;
    dueDate: Date | null;
    paidAt: Date | null;
  } | null;

  cancellationRequest?:{
    requestedAt: Date;
    reason:string;
    calculatedRefund:number;
    approvedAt?:Date;
  }

    user?: {
    _id: string;
    firstName: string;
    lastName: string;
    phone: string;
    gender: string;
    email: string;
  };

  package?: {
    packageId?: string;
    packageName?: string;
    title?: string;
    startDate?: Date;
    endDate?: Date;
    price?: number;
  };
}


//cancelled requests with package and booking details
export interface CancellationRequestsList {
  bookingId: string;
  status: BOOKINGSTATUS;
  refundAmount: number;
  cancellationReason : string;
  requestedAt : string;
  user: {
    userId : string;
    name: string;
    email: string;
    phone: string;
  };
  package: {
    packageId : string;
    packageName: string;
    title: string;
    startDate: Date;
    endDate: Date;
  };
}

export type FindCancellationRequestsDto = IBookingEntity & {
  package: IPackageEntity; 
  user: IClientEntity; 
};

//PAGINATED BOOKING WITH USER DETAILS
export interface PaginatedBookingListWithUserDetails {
  bookings: BookingListWithUserDetailsDto[];
  total: number;
}

//PAGINATED BOOKING WITH USER DETAILS FOR VENDOR LISTING DTO
export interface PaginatedBookingListWithUserDetailsVendorDto {
  bookings: BookingListVendorDto[];
  total: number;
  minTravelersCount: number;
}

//PAGINATED BOOKING WITH USER DETAILS GUIDE LISTING DTO
export interface PaginatedBookingListWithUserDetailsGuideDto {
  bookings: BookingListVendorDto[];
  total: number;
}


//PAGINATED CANCELLATION REQUESTS
export interface PaginatedCancellationRequests {
  bookings : CancellationRequestsList[],
  total : number;
}
