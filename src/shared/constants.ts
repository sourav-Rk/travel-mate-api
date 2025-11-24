import { LocalGuideBookingDto } from "../application/dto/response/local-guide-booking.dto";

/**
 *GENDER constants
 */
export enum GENDER {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other",
}


/**
 *PACKAGE BOOKING STATUS
 */
export enum BOOKINGSTATUS {
  APPLIED = "applied",
  CONFIRMED = "confirmed",
  FULLY_PAID = "fully_paid",
  COMPLETED = "completed",
  WAITLISTED = "waitlisted",
  CANCELLED = "cancelled",
  EXPIRED = "expired",
  ADVANCE_PENDING = "advance_pending",
  CANCELLATION_REQUESTED = "cancellation_requested",
}


/**
 * LOCAL GUIDE BOOKING STATUS
 */
export type LocalGuideBookingStatus =
  | "QUOTE_ACCEPTED"
  | "ADVANCE_PENDING"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "FULLY_PAID"
  | "CANCELLED";


/**
 *REVIEW TARGET TYPE
 */
export type REVIEWTARGET = "guide" | "package";


/**
 *HTTP STATUS ENUMS
 */
export enum HTTP_STATUS {
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
}


/**
 *ERROR MESSAGE CONSTANTS
 */
export const ERROR_MESSAGE = {
  USER_ID_OR_EMAIL_OR_ROLE_MISSING: "User id, email or role is missing",
  USER_ID_NOT_FOUND: "User Id not found",
  INVALID_USER_TYPE: "invalid user type ! expect client or vendor",
  INVALID_ROLE_FOR_REGISTRATION: "Invalid role for client registration",
  USER_TYPE_AND_ID_REQUIRED: "user type and id are required",
  USER_BLOCKED: "User blocked successfully",
  USER_UNBLOCKED: "User unblocked successfully",
  ID_AND_STATUS_REQUIRED: "Id and status are required",
  DATA_MUST_BE_STRING_OR_ARARY_OF_STRINGS:
    "Data must be a string or array of strings",
  RESTART_SIGNUP: "Form data expired or not found. Please restart signup",
  REQUEST_REJECTED_BY_ADMIN:
    "Your request has been rejected by the admin ! Please contact admin !",
  USER_NOT_FOUND: "User not found",
  FORBIDDEN_ROLE: "Forbidden role",
  FORBIDDEN:
    "Access denied. You do not have permission to access this resource.",
  EMAIL_NOT_FOUND: "email doesnt exists",
  EMAIL_EXISTS: "email already exists",
  EMAIL_REQUIRED: "Email is required",
  EMAIL_ALREADY_REGISTERED_GOOGLE:
    "This email is alreday registered under a different role . Please use a different Google account",
  PHONE_NUMBER_EXISTS: "mobile number already exists",
  ALTERNATE_PHONE_NUMBER_EXISTS: "alternate phone number already exists",
  PASSWORD_AND_CONFIRM_PASSWORD_REQUIRED:
    "Password and confirm password is required",
  PASSWORD_AND_CONFIRM_PASSWORD_MUST_BE_SAME:
    "Password and confirm password must be same",
  PASSWORD_MUST_BE_EIGHT_CHARACTER_LONG: "password must be 8 characters long",
  INVALID_OTP: "invalid otp",
  UNAUTHORIZED_ACCESS_NOT_LOGIN: "Unauthorized access. You have'nt Logged in",
  UNAUTHORIZED_ACCESS: "Unauthorized access.",
  INVALID_TOKEN: "Access Denied due to Invalid token",
  INVALID_TOKEN_MISSING_EXPIRATION_TIME:
    "Invalid Token : Missing expiration time",
  INVALID_OR_EMPTY_TOKEN_PAYLOAD: "Invalid or empty token payload",
  INVALID_OR_EXPIRED_TOKEN: "invalid or expired token",
  INVALID_USER_ROLE: "invalid user role",
  INVALID_CREDENTIALS: "Invalid Credentials",
  TOKEN_EXPIRED_FORGOT: "Link Validity Expired. Try verify email once more",
  INVALID_REFRESH_TOKEN: "invalid refresh token",
  TOKEN_EXPIRED_ACCESS: "Access Token time out",
  TOKEN_EXPIRED_REFRESH: "Token time out, Please loggin again",
  TOKEN_BLACK_LISTED: "Token is blacklisted",
  TOKEN_MISSING: "Authorization token is required",
  MISSING_OR_INVALID_PUBLIC_ID: "Missing or invalid public id",
  TOKENS_DOES_NOT_MATCH_THE_USER: "Token does not match the user",
  COOKIE_NOT_FOUND: "Cookie not found",
  LIMIT: "Limit must be between 1 and    00",
  SERVER_ERROR: "An error occurred, please try again later.",
  BLOCKED_ERROR: "You are blocked by Admin. please contact admin",
  NOT_ALLOWED: "You are not allowed",
  CURRENT_PASSWORD_WRONG: "Current password is incorrect",
  CURRENT_AND_NEW_SAME: "Current and new password is same",
  UNAUTH_NO_USER_FOUND: "Unauthorized: No user found in request",
  INVALID_ROLE: "Invalid role",
  BLOCKED: "Your account has been blocked.",
  VALIDATION_FAILED: "Validations failed",
  AGENCY_ID_AND_PACKAGE_ID_IS_REQUIRED: "Agency Id and package Id is required",
  AGENCY_NOT_FOUND: "Agency Not found",
  USER_ID_REQUIRED: "User id is required",
  PACKAGE_NOT_FOUND: "Package Not found",
  ITINERARY_NOT_FOUND: "Itinerary not found",
  ID_REQUIRED: "Id is required",
  ACTIVITY_NOT_EXIST: "Activity not exist ",
  PACKAGE_ID_IS_REQUIRED: "Package id is required",
  INVALID_PACKAGE_ID: "Invalid package Id",
  CANNOT_EDIT_PACKAGE: "Package cannot be edited because it is already",
  INSUFFICIENT_DATA: "Insufficient data to do the operation",
  STATUS_CANNOT_BE_UPDATED: "Status cant be updated at this stage",
  ALREADY_APPLIED_PACKAGE: "You already applied for this package",
  TRIP_STATUS: "Booking not allowed! Trip is",
  DATE_FOR_THE_BOOKING_ENDED: "Date for the booking closed",
  CONFLICTING_TRIP: "You already have a trip during this period",
  PACKAGE_BLOCKED: "Package has been blocked by the admin",
  BOOKING_NOT_FOUND: "Booking not found",
  NOTIFICATION_NOT_FOUND: "Notification not found",
  STRIPE_PAYMENT_ERROR:
    "We couldn’t generate a payment link at the moment. Please try again in a few minutes.",
  CONFLICT_IN_AMOUNT: "conflict in amount",
  DUE_DATE_FOR_ADVANCE_PAYMENT_END:
    "The due date for the advance payment has ended",
  DUE_DATE_FOR_FULL_PAYMENT_END: "The due date for the full payment has ended",
  ALREADY_PAID_ADVANCE: "You already paid the advance amount",
  ALREADY_PAID_FULL_AMOUNT: "You already paid the full amount",
  PACKAGE_CANNOT_BE_BLOCKED:
    "Package cannot be blocked after payment alert is sent.",
  WISHLIST_NOT_FOUND: "Wishlist not found",
  REQUIRED_FIELDS_MISSING: "Required fields are missing",
  ALREADY_REVIEWED: "You already added the review",
  GUIDE_NOT_FOUND: "Guide not found",
  GUIDE_AND_AGENCY_CONFLICT: "Guide and Package belong to different agencies",
  PACKAGE_ALREADY_COMPLETED: "Package is already completed",
  PACKAGE_ID_MISSING_AFTER_SAVE: "Package id is missing after save",
  ONLY_ASSIGN_GUIDE_IF_PACKAGE_IS_CLOSED:
    "Guide can only be assigned after the applications are closed",
  GUIDE_ASSIGNED_FOR_ANOTHER_TRIP:
    "Guide not available as the guide is assigned for another trip",
  GUIDE_ALREADY_ASSIGNED: "Guide already assigned for this trip",
  STATUS_REQUIRED: "Status is required",
  TRIP_ALREADY_COMPLETED: "Trip is already completed",
  CANNOT_CHANGE_STATUS: "Status cant be updated as the trip is not over yet",
  FAILED_TO_SEND_MESSAGE: "Failed to sent message",
  MARK_READ_FAILED: "Mark as read failed",
  CHATROOM_NOT_FOUND: "Chatroom not found",
  WALLET_NOT_FOUND: "Wallet not found",
  RATING_ERROR: "Rating must be between 1 and 5",

  LOCAL_GUIDE: {
    LOCAL_GUIDE_PROFILE_NOT_FOUND: "Local guide profile not found",
    NOT_VERIFIED_LOCAL_GUIDE: "You are not a verified local guide",
    LOCAL_GUIDE_PROFILE_ALREADY_EXISTS:
      "Local guide profile already exists for this user",
    LOCAL_GUIDE_ALREADY_VERIFIED: "Local guide is already verified",
    LOCAL_GUIDE_NOT_VERIFIED: "Local guide is not verified",
    VERIFICATION_ALREADY_PENDING: "Verification request is already pending",
    INVALID_COORDINATES:
      "Invalid coordinates format. Must be [longitude, latitude]",
    LOCATION_REQUIRED: "Location with precise coordinates is required",
    ALREADY_REJECTED: "Verification request has already been rejected",
    BADGE_ID_ALREADY_EXISTS: (badgeId: string) =>
      `Badge with ID '${badgeId}' already exists`,
    BADGE_ID_IS_REQUIRED: "Badge Id is required",
    BADGE_NOT_FOUND: (badgeId: string) =>
      `Badge with ID '${badgeId}' not found`,
    FAILED_TO_UPDATE_BADGE: (badgeId: string) =>
      `Failed to update badge with ID '${badgeId}'`,
  },

  VOLUNTEER_POST: {
    ALREADY_LIKED: "You have already liked this post",
    NOT_LIKED: "You have not liked this post",
    POST_NOT_FOUND: "Volunteer post not found",
    LOCAL_GUIDE_PROFILE_NOT_FOUND: "Local guide profile not found",
    GUIDE_NOT_VERIFIED: "Local guide must be verified to create posts",
    INVALID_COORDINATES:
      "Invalid coordinates format. Must be [longitude, latitude]",
    PROFILE_HOURLY_RATE_REQUIRED:
      "Profile hourly rate is required when offering guide service. Please update your profile with an hourly rate.",
    MAX_IMAGES_EXCEEDED: "Maximum 10 images allowed per post",
    MAX_TAGS_EXCEEDED: "Maximum 20 tags allowed per post",
    UNAUTHORIZED_ACCESS: "You are not authorized to perform this action",
  },

  ADDRESS: {
    ADDRESS_NOT_FOUND: "Address not found",
  },

  BOOKING_CANCELLATION: {
    CANCELLATION_NOT_ALLOWED: "Cancellation not allowed for this booking",
    NO_CANCELLATION_REQUEST: "No cancellation request pending for this booking",
    INVALID_CANCELLATION_DATA: "Invalid cancellation request data",
    CANCELLATION_ALREADY_REQUESTED: "Cancellation Already requested",
    CANCELLATION_REASON_REQUIRED: "Cancellation reason is required",
  },

  REFUND: {
    REFUND_AMOUNT_GREATER_THAN_ZERO: "Refund amount must be greater than 0",
  },

  GUIDE_INSTRUCTIONS: {
    NO_TRAVELLERS_FOUND: "No travellers found for this package",
    GUIDE_ASSIGNED_CONFLICT: "This guide is not assigned for this trip",
    INSTRUCTION_NOT_FOUND: "Instruction not found",
  },

  GROUP: {
    ATLEAST_TWO_MEMBERS: "Group chat must have at least 2 members",
    NO_GROUP_CHAT: "No group chat found for this package",
    NOT_A_MEMBER: "You are not a member of this group chat",
    GROUP_NOT_FOUND: "Group not found",
    FAILED_TO_JOIN_GROUP_CHAT: "Failed to join group chat",
    MISSING_MESSAGE_DATA: "Missing message data",
    MISSING_GROUP_CHAT_ID: "Missing group chat id",
    FAILED_TO_LEAVE_GROUP_CHAT: "Failed to leave group chat",
    MISSING_REQUIRED_DATA: "Missing required data",
    FAILED_TO_START_TYPING: "Failed to start typing",
    FAILED_TO_STOP_TYPING: "Failed to stop typing",
    FAILED_TO_GET_ONLINE_MEMBERS: "Failed to get online members",
    FAILED_TO_MARK_MESSAGE_DELIVERED: "Failed to mark message as delivered",
    FAILED_TO_MARK_MESSAGE_READ: "Failed to mark message as read",
  },

  GUIDE_CHAT: {
    SELF_CHAT_NOT_ALLOWED:
      "Traveller and guide cannot be the same account for guide chat.",
  },

  QUOTE: {
    GUIDE_PROFILE_NOT_FOUND: "Local guide profile not found",
    HOURLY_RATE_NOT_SET: "Hourly rate is not set in your profile",
    INVALID_SESSION_DATE: "Session date must be in the future",
    INVALID_HOURS: "Hours must be greater than 0",
    QUOTE_PAYLOAD_REQUIRED: "Quote payload is required for quote message type",
    ROOM_NOT_FOUND: "Chat room not found",
    ONLY_GUIDE_CAN_CREATE_QUOTE: "Only guides can create quotes",
    QUOTE_NOT_FOUND: "Quote not found",
    QUOTE_ALREADY_PROCESSED: "Quote has already been accepted or declined",
    QUOTE_EXPIRED: "Quote has expired",
    ONLY_TRAVELLER_CAN_ACCEPT: "Only the traveller can accept quotes",
    ONLY_TRAVELLER_CAN_DECLINE: "Only the traveller can decline quotes",
    BOOKING_ALREADY_EXISTS: "A booking already exists for this quote",
    OVERLAPPING_BOOKING: "Guide has a conflicting booking at this time",
  },

  LOCAL_GUIDE_BOOKING: {
    BOOKING_NOT_FOUND: "Local guide booking not found",
    ALREADY_PAID_ADVANCE: "Advance payment has already been paid",
    ALREADY_PAID_FULL: "Full payment has already been paid",
    CONFLICT_IN_AMOUNT: "Payment amount does not match the required amount",
    DUE_DATE_FOR_ADVANCE_PAYMENT_END: "Advance payment due date has passed",
    DUE_DATE_FOR_FULL_PAYMENT_END: "Full payment due date has passed",
    INVALID_BOOKING_STATUS: "Booking is not in a valid state for this payment",
    SERVICE_NOT_COMPLETED:
      "Service must be completed before making full payment",
    ADVANCE_NOT_PAID: "Advance payment must be completed before full payment",
    BOOKING_ID_AND_AMOUNT_REQUIRED: "Booking ID and amount are required",
    SERVICE_ALREADY_COMPLETED: "Service has already been completed",
    ADVANCE_PAYMENT_REQUIRED:
      "Advance payment must be completed before marking service as complete",
    ONLY_TRAVELLER_CAN_COMPLETE:
      "Only the traveller can mark the service as complete",
    ONLY_TRAVELLER_CAN_PAY_THE_AMOUNT: "Only the traveller can pay the amount",
  },

  CHAT: {
    FAILED_TO_START_CHAT: "Failed to start chat",
    MESSAGE_TEXT_REQUIRED: "Message text is required",
    MEDIA_ATTACHMENT_REQUIRED: "Media attachment required for media message",
    CHAT_ROOM_ID_REQUIRED: "Chat room id is required",
  },
};


/**
 *SUCCESS MESSAGE CONSTANTS 
 */
export const SUCCESS_MESSAGE = {
  ACCOUNT_CREATED: `Account created succesfully`,
  LOGIN_SUCCESS: "Logged in successfully",
  LOGOUT_SUCCESS: "Logout successfully!",
  OTP_RESENT_SUCCESS: "OTP resend successfully",
  OTP_SEND_SUCCESS: "Otp send successfully",
  OTP_VERIFIED: "Otp verified successfully",
  OPERATION_SUCCESS: "Operation completed successfully.",
  IMAGE_UPLOADED_SUCCESSFULLY: "Image uploaded successfully",
  FCM_TOKEN_SAVED: "Fcm Token saved successfully",
  REQUEST_REJECTED: "Request Rejected",
  ADD_GUIDE_SUCCESSFULLY:
    "Added guide successfully  ! Link for password reset has been sent to the guide email id",
  PASSWORD_UPDATE_GUIDE:
    "Password set successfully!you can login to your account",
  PROFILE_UPDATED_SUCCESS: "Profile updated successfully",
  RESET_LINK_SEND: "A password reset link has been sent to your email account",
  PASSWORD_CHANGED: "Password changed successfully",
  PACKAGE_ADDED: "Package added successfully",
  PACKAGE_UPDATED: "Package updated successfully",
  ITINERARY_UPDATED_SUCCESS: "Itinerary updated successfully",
  ACTIVITY_ADDED: "Activity added successfully",
  ACTIVITY_UPDATED: "Activity update successfully",
  ACTIVITY_DELETED: "Activity deleted successfully",
  STATUS_UPDATED_SUCCESS: "Status Updated successfully",
  STATUS_TO_REVIEWING: "status updated to reviewing",
  BOOKING_WAITLISTED:
    "Your request is in waiting list! we will notify you if seats are available",
  BOOKING_APPLIED:
    "You have successfully applied to the package! Wait for the agency to verify",
  BOOKING_ADVANCE_PENDING:
    "You have successfully applied to the package! Pay the advance to confirm the slot",
  PAYMENT_ALERT: "Payment alert have been send successfully to the travelers",
  MARK_AS_READ: "Notification marked as read",
  ALL_MARK_READ: "Marked all as read",
  CHECKOUT_SESSION_CREATED: "checkout session created",
  WEBHOOK_PROCESSED: "Webhook processes",
  ADDED_TO_WISHLIST: "Added to wishlist",
  REMOVED_FROM_WISHLIST: "Removed from wishlist",
  ADDED_REVIEW: "Review added successfully",
  GUIDE_ASSIGNED_SUCCESSFULLY: "Guide assigned successfully",
  MESSAGES_FETCHED: "messages fetched successfully",
  DETAILS_FETCHED: "Details fetched successfully",

  ADDRESS: {
    ADDRESS_ADDED_SUCCESSFULLY: "address added successfully",
    ADDRESS_UPDATED: "Address Updated successfully",
  },

  KYC: {
    ADDED_SUCCESSFULLY: "kyc added succesfully",
  },

  BOOKING_CANCELLATION: {
    CANCELLATION_REQUESTED: (amount: number) =>
      `Cancellation requested successfully! Your refund of ₹${amount} will be processed after vendor approval.`,
    CANCELLATION_APPROVED: "Cancellation Approved successfully",
  },

  GUIDE_INSTRUCTION: {
    ADDED_SUCCESSFULLY: "Instruction added successfully",
    INSTRUCTION_MARKED_AS_READ: "Instruction marked as read",
    ALL_INSTRUCTIONS_MARKED_AS_READ: "All instructions marked as read",
  },

  LOCAL_GUIDE: {
    VERIFICATION_REQUESTED: "Verification request submitted successfully",
    VERIFICATION_RESUBMITTED:
      "Verification request resubmitted successfully. Your request is now pending review",
    VERIFICATION_APPROVED: "Local guide verification approved",
    VERIFICATION_REJECTED: "Local guide verification rejected",
    PROFILE_CREATED: "Local guide profile created successfully",
    PROFILE_UPDATED: "Local guide profile updated successfully",
    AVAILABLE: "Successfully set to available",
    NOT_AVAILABLE: "Successfully set to not available",
    SERVICE_MARKED_COMPLETE: "Service marked as complete successfully",
    QUOTE_CREATED: "Quote created successfully",
    BADGES_EVALUATED: "Badges evaluated successfully",
    BADGE_CREATED: "Badge created succesfully",
    BADGE_UPDATED: "Badge updated succesfully",
    BADGE_DISABLED: "Badge disabled succesfully",
  },

  VOLUNTEER_POST: {
    POST_CREATED: "Post created successfully",
    POST_UPDATED: "Post updated successfully",
    POST_DELETED: "Post deleted successfully",
    POST_LIKED: "Post liked successfully",
    POST_UNLIKED: "Post unliked successfully",
  },

  LOCAL_GUIDE_BOOKING: {
    QUOTE_ACCEPTED: "Quote accepted succesfully! Pay the advance to confirm",
  },
};



export const ROLES = {
  ADMIN: "admin",
  CLIENT: "client",
  VENDOR: "vendor",
  GUIDE: "guide",
} as const;

export const STATUS = {
  VERIFIED: "verified",
  PENDING: "pending",
  REVIEWING: "reviewing",
  REJECTED: "rejected",
} as const;

export const GUIDE_SPECIALTIES = {
  FOOD: "food",
  CULTURE: "culture",
  HISTORY: "history",
  ADVENTURE: "adventure",
  NIGHTLIFE: "nightlife",
  SHOPPING: "shopping",
  NATURE: "nature",
  PHOTOGRAPHY: "photography",
  FAMILY_FRIENDLY: "family-friendly",
} as const;

export const VERIFICATION_STATUS = {
  PENDING: "pending",
  REVIEWING: "reviewing",
  VERIFIED: "verified",
  REJECTED: "rejected",
} as const;

export type TRole = "admin" | "vendor" | "client" | "guide";
export type TStatus = "pending" | "verified" | "rejected";
export type TVerificationStatus =
  | "pending"
  | "reviewing"
  | "verified"
  | "rejected";

export type PackageStatus =
  | "draft"
  | "active" //visible , bookabale
  | "applications_closed" //not bookable anymore
  | "ongoing" //trip started
  | "completed" //trip finished
  | "cancelled"; //trip cancelled

export type BookingStatus =
  | "applied"
  | "pending"
  | "confirmed"
  | "completed"
  | "waitlisted"
  | "cancelled"
  | "expired";

export enum EVENT_EMMITER_TYPE {
  SENDMAIL = "sendmail",
  LOCAL_GUIDE_STATS_UPDATED = "local_guide_stats_updated",
}

export enum MAIL_CONTENT_PURPOSE {
  OTP = "otp",
  EMAIL_CHANGE = "email change",
  GUIDE_LOGIN = "guide login",
  REQUEST_REJECTED = "request rejected",
  RESET_PASSWORD = "reset password",
}

//email purpose
export type EmailOtpPurpose = "signup" | "forgot-password" | "resend";

//cookies names
export const COOKIES_NAMES = {
  REFRESH_TOKEN: "refresh_token",
  ACCESS_TOKEN: "access_token",
};

export enum TRANSACTION_TYPE {
  CREDIT = "credit",
  DEBIT = "debit",
}

export type TRANSACTION_TYPE_FILTER = "credit" | "debit" | "all";

export type SORT_BY_TRANSACTIONS = "newest" | "oldest";

export const TRANSACTION_DESCRIPTIONS = {
  ADVANCE_PAYMENT: (bookingId: string) =>
    `Advance payment for booking ${bookingId}`,
  ADVANCE_COMMISSION: (bookingId: string) =>
    `Commission from advance payment for booking ${bookingId}`,
  FULL_COMMISSION: (bookingId: string) =>
    `Commision for full payment for booking ${bookingId}`,
  REFUND_FOR_BOOKING_CANCELLATION: (bookingId: string) =>
    `Refund for cancellation of booking ${bookingId}`,
  CANCELLATION_REFUND: (bookingId: string) =>
    `Refund deduction for cancelled booking ${bookingId}`,
  LOCAL_GUIDE_ADVANCE_PAYMENT: (bookingId: string) =>
    `Payment received for local guide booking ${bookingId} (Advance)`,
  LOCAL_GUIDE_FULL_PAYMENT: (bookingId: string) =>
    `Payment received for local guide booking ${bookingId} (Full)`,
};

export interface CancellationPolicy {
  id: CANCELLATION_REFUND_POLICY;
  label: string;
  description: string;
  refundPercentage: number;
  advanceRefundPercentage: number;
}

export enum CANCELLATION_REFUND_POLICY {
  CONFIRMED_MORE_THAN_10_DAYS = "confirmed_more_than_10_days",
  CONFIRMED_LESS_THAN_10_DAYS = "confirmed_less_than_10_days",
  FULLY_PAID_MORE_THAN_7_DAYS = "fully_paid_more_than_7_days",
  FULLY_PAID_LESS_THAN_7_DAYS = "fully_paid_less_than_7_days",
  NON_REFUNDABLE = "non_refundable",
}

export const CANCELLATION_POLICIES: Record<
  CANCELLATION_REFUND_POLICY,
  CancellationPolicy
> = {
  [CANCELLATION_REFUND_POLICY.CONFIRMED_MORE_THAN_10_DAYS]: {
    id: CANCELLATION_REFUND_POLICY.CONFIRMED_MORE_THAN_10_DAYS,
    label: "≥10 days before trip",
    description: "80% of advance refundable",
    refundPercentage: 0,
    advanceRefundPercentage: 80,
  },
  [CANCELLATION_REFUND_POLICY.CONFIRMED_LESS_THAN_10_DAYS]: {
    id: CANCELLATION_REFUND_POLICY.CONFIRMED_LESS_THAN_10_DAYS,
    label: "<10 days before trip",
    description: "60% of advance refundable",
    refundPercentage: 0,
    advanceRefundPercentage: 60,
  },
  [CANCELLATION_REFUND_POLICY.FULLY_PAID_MORE_THAN_7_DAYS]: {
    id: CANCELLATION_REFUND_POLICY.FULLY_PAID_MORE_THAN_7_DAYS,
    label: "≥7 days before trip",
    description: "70% of total amount refundable",
    refundPercentage: 70,
    advanceRefundPercentage: 100,
  },
  [CANCELLATION_REFUND_POLICY.FULLY_PAID_LESS_THAN_7_DAYS]: {
    id: CANCELLATION_REFUND_POLICY.FULLY_PAID_LESS_THAN_7_DAYS,
    label: "<7 days before trip",
    description: "60% of total amount refundable",
    refundPercentage: 60,
    advanceRefundPercentage: 100,
  },
  [CANCELLATION_REFUND_POLICY.NON_REFUNDABLE]: {
    id: CANCELLATION_REFUND_POLICY.NON_REFUNDABLE,
    label: "Non-refundable",
    description: "No refund available",
    refundPercentage: 0,
    advanceRefundPercentage: 0,
  },
};

export type INSTRUCTION_PRIORITY = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type INSTRUCTION_TYPE =
  | "MEETING_POINT"
  | "ITINERARY_UPDATE"
  | "SAFETY_INFO"
  | "REMINDER"
  | "GENERAL";

export type CHAT_CONTEXT_TYPE =
  | "vendor_client"
  | "guide_client"
  | "client_client";
export type CHAT_USERS = "client" | "guide" | "vendor";

export const POST_CATEGORY = {
  HIDDEN_SPOTS: "hidden-spots",
  RESTAURANTS: "restaurants",
  SAFETY: "safety",
  CULTURE: "culture",
  STAYS: "stays",
  TRANSPORTATION: "transportation",
  SHOPPING: "shopping",
  ENTERTAINMENT: "entertainment",
  NATURE: "nature",
  HISTORY: "history",
  OTHER: "other",
} as const;

export const POST_STATUS = {
  DRAFT: "draft",
  PUBLISHED: "published",
  ARCHIVED: "archived",
  HIDDEN: "hidden",
} as const;

export type TPostStatus = "draft" | "published" | "archived" | "hidden";
export type TPostCategory =
  | "hidden-spots"
  | "restaurants"
  | "safety"
  | "culture"
  | "stays"
  | "transportation"
  | "shopping"
  | "entertainment"
  | "nature"
  | "history"
  | "other";

export type MetadataValue = string | number | boolean | Date | null | undefined;

export const NOTIFICATION_TYPE = {
  INFO: "info",
  BOOKING: "booking",
  MESSAGE: "message",
  PAYMENT: "payment",
  SUCCESS: "success",
  ERROR: "error",
} as const;

export const NOTIFICATIONS = {
  TTILE: {
    BOOKING_CANCELLATION_REQUEST: "Booking Cancellation Request",
    BOOKING_CANCELLATION_APPROVED: "Booking Cancellation Approved",
    CANCELLATION_REQUESTED: "Cancellation Requested",
  },
  MESSAGES: {
    NOTIFY_BOOKING_CANCELLATION_VENDOR: (
      refundAmount: number,
      clientName: string,
      bookingId: string,
      cancellationReason: string
    ) => `Client ${clientName} has requested to cancel booking ${bookingId}. 
            Reason: ${cancellationReason}.
            A refund of ₹${refundAmount} will be processed. `,
    NOTIFY_APPROVE_CANCELLATION_CLIENT: (
      refundAmount: number,
      bookingId: string,
      vendorName: string
    ) =>
      `Your cancellation request for booking ${bookingId} has been approved by ${vendorName}. ₹${refundAmount} has been refunded to your wallet.`,
    NOTIFY_CANCELLATION_REQUESTED_TO_VENDOR: (
      name: string,
      bookingId: string,
      packageName: string
    ) =>
      `${name} has requested cancellation for the booking ${bookingId}-${packageName}`,
  },
};

export type LocalGuidePaymentFilter =
  | "advance_due"
  | "advance_overdue"
  | "full_due"
  | "full_paid";

export type LocalGuideBookingCategory = "pending" | "completed";

export interface LocalGuideBookingListFilters {
  category?: LocalGuideBookingCategory;
  status?: LocalGuideBookingStatus;
  paymentStatus?: LocalGuidePaymentFilter;
  search?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export interface StatsUpdatePayload {
  guideProfileId: string;
  stats: {
    totalLikes: number;
    totalViews: number;
    maxPostLikes: number;
    maxPostViews: number;
    completionRate: number;
    completedSessions: number;
    totalSessions: number;
    averageRating: number;
    totalRatings: number;
    totalPosts: number;
  };
  trigger?: "service_completion" | "post_creation" | "post_like" | "post_view";
}
