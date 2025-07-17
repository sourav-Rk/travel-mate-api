export enum GENDER {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other",
}

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
  USER_NOT_FOUND: "User not found",
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
  SERVER_ERROR: "An error occurred, please try again later.",
  BLOCKED_ERROR: "You are blocked by Admin. please contact admin",
  NOT_ALLOWED: "You are not allowed",
};

export const SUCCESS_MESSAGE = {
  LOGOUT_SUCCESS: "Logout successfully!",
  OTP_RESENT_SUCCESS: "OTP resend successfully",
  OPERATION_SUCCESS: "Operation completed successfully.",
  ADD_GUIDE_SUCCESSFULLY:
    "Added guide successfully  ! Link for password reset has been sent to the guide email id",
  PASSWORD_UPDATE_GUIDE:
    "Password set successfully!you can login to your account",
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

export enum EVENT_EMMITER_TYPE {
  SENDMAIL = "sendmail",
}

export enum MAIL_CONTENT_PURPOSE {
  OTP = "otp",
  GUIDE_LOGIN = "guide login",
}

//email purpose
export type EmailOtpPurpose = "signup" | "forgot-password" | "resend";
