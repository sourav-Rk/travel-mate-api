import { Transform } from "class-transformer";
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from "class-validator";

export enum USER_TYPES {
  VENDOR = "vendor",
  CLIENT = "client",
  GUIDE = "guide"
}

export enum VENDOR_STATUS {
  PENDING = "pending",
  VERIFIED = "verified",
  REVIEWING ="reviewing",
  REJECTED ="rejected"
}

export enum DASHBOARD_PERIOD {
  DAILY = "daily",
  WEEKLY = "weekly",
  MONTHLY = "monthly",
  YEARLY = "yearly",
  CUSTOM = "custom",
}

export class GetAllUsersReqDTO {
  @Transform(({ value }) => Number(value))
  @IsNumber({}, { message: "Page must be a number" })
  @Min(1, { message: "Page must be at least 1" })
  page: number = 1;

  @Transform(({ value }) => Number(value))
  @IsNumber({}, { message: "Limit must be a number" })
  @Min(1, { message: "Limit must be at least 1" })
  limit: number = 10;

  @IsEnum(USER_TYPES, {
    message: "userType must be either 'vendor' or 'client'",
  })
  userType?: USER_TYPES;

  @IsOptional()
  @IsString({ message: "searchTerm must be a string" })
  searchTerm?: string;

  @IsString({ message: "status must be a string" })
  status?: string;
}

export class GetUserDetailsReqDTO {
  @IsEnum(USER_TYPES, {
    message: "userType must be either 'vendor' or 'client'",
  })
  userType?: USER_TYPES;

  @IsString({ message: "userID must be a string" })
  @IsNotEmpty({ message: "userId is required" })
  userId?: string;
}

export class UpdateVendorStatusReqDTO {
  @IsString({ message: "vendorId must be a string" })
  @IsNotEmpty({ message: "vendorId is required" })
  vendorId!: string;

  @IsEnum(VENDOR_STATUS, {
    message: "status must be either 'pending' or 'verified'",
  })
  status!: VENDOR_STATUS;

  @IsOptional()
  @IsString({ message: "reason must be a string" })
  reason?: string;
}

export class UpdateUserStatusReqDTO extends GetUserDetailsReqDTO{}

export class GetDashboardStatsReqDTO {
  @IsOptional()
  @IsEnum(DASHBOARD_PERIOD, {
    message: "period must be one of: daily, weekly, monthly, yearly",
  })
  period?: DASHBOARD_PERIOD;

  @IsOptional()
  @IsString({ message: "startDate must be a valid ISO date string" })
  startDate?: string;

  @IsOptional()
  @IsString({ message: "endDate must be a valid ISO date string" })
  endDate?: string;
}

export class GetAdminSalesReportReqDTO {
  @IsOptional()
  @IsEnum(DASHBOARD_PERIOD, {
    message: "period must be one of: daily, weekly, monthly, yearly, custom",
  })
  period?: DASHBOARD_PERIOD = DASHBOARD_PERIOD.MONTHLY;

  @IsOptional()
  @IsString({ message: "startDate must be a valid ISO date string" })
  startDate?: string;

  @IsOptional()
  @IsString({ message: "endDate must be a valid ISO date string" })
  endDate?: string;

  @IsOptional()
  @IsString({ message: "vendorId must be a string" })
  vendorId?: string;

  @IsOptional()
  @IsString({ message: "packageId must be a string" })
  packageId?: string;
}