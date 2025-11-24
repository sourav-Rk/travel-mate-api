
export type QuoteStatus = "pending" | "accepted" | "declined" | "expired";

export interface QuoteLocationDto {
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
}

export interface QuoteMessagePayload {
  quoteId: string;
  sessionDate: string;
  sessionTime: string;
  hours: number;
  hourlyRate: number;
  totalAmount: number;
  location?: QuoteLocationDto;
  notes?: string;
  status: QuoteStatus;
  expiresAt: string;
}

export interface QuoteDto {
  quoteId: string;
  guideChatRoomId: string;
  sessionDate: string; 
  sessionTime: string;
  hours: number;
  hourlyRate: number;
  totalAmount: number;
  location?: QuoteLocationDto;
  notes?: string;
  status: QuoteStatus;
  expiresAt: string;
  createdAt: string;
  createdBy: string;
  guideName?: string;
  guideProfileImage?: string;
}

export type LocalGuideBookingStatus =
  | "QUOTE_ACCEPTED"
  | "ADVANCE_PENDING"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "FULLY_PAID"
  | "CANCELLED";

export interface LocalGuideBookingDto {
  _id: string;
  bookingId: string;
  travellerId: string;
  guideId: string;
  guideProfileId: string;
  quoteId: string;
  guideChatRoomId: string;
  sessionDate: string; // ISO date string
  sessionTime: string; // HH:mm format
  hours: number;
  hourlyRate: number;
  totalAmount: number;
  location?: QuoteLocationDto;
  notes?: string;
  status: LocalGuideBookingStatus;
  advancePayment: {
    amount: number;
    paid: boolean;
    dueDate: string; // ISO date string
    paidAt?: string | null; // ISO date string
  };
  fullPayment: {
    amount: number;
    paid: boolean;
    dueDate?: string | null; // ISO date string
    paidAt?: string | null; // ISO date string
  };
  serviceCompletedAt?: string; // ISO date string
  completionNotes?: string;
  completionRating?: number; // 1-5 rating
  cancelledAt?: string; // ISO date string
  cancellationRequest?: {
    requestedAt: string; // ISO date string
    reason: string;
    calculatedRefund?: number;
    approvedAt?: string; // ISO date string
  } | null;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  guideName?: string;
  guideProfileImage?: string;
  travellerName?: string;
  travellerProfileImage?: string;
}

export interface LocalGuideBookingListResult {
  bookings: LocalGuideBookingDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  summary: {
    pendingCount: number;
    completedCount: number;
  };
}
