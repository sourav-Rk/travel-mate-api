export enum GENDER {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other",
}

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

export type REVIEWTARGET = "guide" | "package";

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

export const ERROR_MESSAGE = {
  RESTART_SIGNUP: "Form data expired or not found. Please restart signup",
  REQUEST_REJECTED_BY_ADMIN:
    "Your request has been rejected by the admin ! Please contact admin !",
  USER_NOT_FOUND: "User not found",
  FORBIDDEN_ROLE: "Forbidden role",
  FORBIDDEN:
    "Access denied. You do not have permission to access this resource.",
  EMAIL_NOT_FOUND: "email doesnt exists",
  EMAIL_EXISTS: "email already exists",
  PHONE_NUMBER_EXISTS: "mobile number already exists",
  UNAUTHORIZED_ACCESS_NOT_LOGIN: "Unauthorized access. You have'nt Logged in",
  UNAUTHORIZED_ACCESS: "Unauthorized access.",
  INVALID_TOKEN: "Access Denied due to Invalid token",
  INVALID_USER_ROLE: "invalid user role",
  INVALID_CREDENTIALS: "Invalid Credentials",
  TOKEN_EXPIRED_FORGOT: "Link Validity Expired. Try verify email once more",
  INVALID_REFRESH_TOKEN: "invalid refresh token",
  TOKEN_EXPIRED_ACCESS: "Access Token time out",
  TOKEN_EXPIRED_REFRESH: "Token time out, Please loggin again",
  TOKEN_BLACK_LISTED: "Token is blacklisted",
  TOKEN_MISSING: "Authorization token is required",
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

  BOOKING_CANCELLATION: {
    CANCELLATION_NOT_ALLOWED: "Cancellation not allowed for this booking",
    NO_CANCELLATION_REQUEST: "No cancellation request pending for this booking",
    INVALID_CANCELLATION_DATA: "Invalid cancellation request data",
    CANCELLATION_ALREADY_REQUESTED : "Cancellation Already requested",
  },

  REFUND: {
    REFUND_AMOUNT_GREATER_THAN_ZERO: "Refund amount must be greater than 0",
  },
};

export const SUCCESS_MESSAGE = {
  LOGIN_SUCCESS: "Logged in successfully",
  LOGOUT_SUCCESS: "Logout successfully!",
  OTP_RESENT_SUCCESS: "OTP resend successfully",
  OTP_SEND_SUCCESS: "Otp send successfully",
  OPERATION_SUCCESS: "Operation completed successfully.",
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

  BOOKING_CANCELLATION: {
    CANCELLATION_REQUESTED: (amount : number) =>
      `Cancellation requested successfully! Your refund of ₹${amount} will be processed after vendor approval.`,
    CANCELLATION_APPROVED : 'Cancellation Approved successfully'
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

export type TRole = "admin" | "vendor" | "client" | "guide";
export type TStatus = "pending" | "verified" | "rejected";

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
