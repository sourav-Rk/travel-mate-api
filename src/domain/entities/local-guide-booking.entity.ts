import { LocalGuideBookingStatus } from "../../shared/constants";

export interface ILocalGuideBookingEntity {
  _id?: string;
  bookingId: string;
  travellerId: string;
  guideId: string;
  guideProfileId: string;
  quoteId: string;
  guideChatRoomId: string;
  sessionDate: Date;
  sessionTime: string;
  hours: number;
  hourlyRate: number;
  totalAmount: number;
  location?: {
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
  };
  notes?: string;
  status: LocalGuideBookingStatus;
  advancePayment: {
    amount: number;
    paid: boolean;
    dueDate: Date;
    paidAt?: Date | null;
  };
  fullPayment: {
    amount: number;
    paid: boolean;
    dueDate?: Date | null;
    paidAt?: Date | null;
  };
  serviceCompletedAt?: Date;
  completionNotes?: string;
  completionRating?: number;
  cancelledAt?: Date;
  cancellationRequest?: {
    requestedAt: Date;
    reason: string;
    calculatedRefund?: number;
    approvedAt?: Date;
  };
  createdAt?: Date;
  updatedAt?: Date;
  guideName?: string;
  guideProfileImage?: string;
  travellerName?: string;
  travellerProfileImage?: string;
}
