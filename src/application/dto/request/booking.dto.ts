import { Transform } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";


export enum BOOKING_STATUS {
  ALL = "all",
  CONFIRMED = "confirmed",
  FULLY_PAID = "fully_paid",
  ADVANCE_PENDING = "advance_pending",
  COMPLETED = "completed",
  WAITLISTED = "waitlisted",
}

export enum VENDOR_BOOKING_STATUS {
  ALL = "all",
  ADVANCE_PENDING = "advance_pending",
  CONFIRMED = "confirmed",
  APPLIED = "applied",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  WAITLISTED = "waitlisted",
}

export class GetBookingOfThePackageGuideReqDTO {
  @IsString({ message: "packageId must be a string" })
  @IsNotEmpty({ message: "packageId is required" })
  packageId!: string;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber({}, { message: "page must be a number" })
  @Min(1, { message: "page must be at least 1" })
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber({}, { message: "limit must be a number" })
  @Min(1, { message: "limit must be at least 1" })
  limit?: number = 5;

  @IsOptional()
  @IsString({ message: "searchTerm must be a string" })
  searchTerm?: string;

  @IsOptional()
  @IsEnum(BOOKING_STATUS, {
    message:
      "status must be one of all, confirmed, fully_paid, advance_pending, completed, waitlisted",
  })
  status?: BOOKING_STATUS = BOOKING_STATUS.ALL;
}

export class GetBookingsVendorReqDTO {
  @IsString({ message: "packageId must be a string" })
  @IsNotEmpty({ message: "packageId is required" })
  packageId!: string;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber({}, { message: "page must be a number" })
  @Min(1, { message: "page must be at least 1" })
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber({}, { message: "limit must be a number" })
  @Min(1, { message: "limit must be at least 1" })
  limit?: number = 5;

  @IsOptional()
  @IsString({ message: "searchTerm must be a string" })
  searchTerm?: string;

  @IsOptional()
  @IsEnum(VENDOR_BOOKING_STATUS, {
    message:
      "status must be one of all, advance_pending, confirmed, applied, completed, cancelled, waitlisted",
  })
  status?: VENDOR_BOOKING_STATUS = VENDOR_BOOKING_STATUS.ALL;
}
