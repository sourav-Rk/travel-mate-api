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
