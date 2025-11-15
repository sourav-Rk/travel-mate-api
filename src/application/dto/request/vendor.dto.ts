import {
  IsString,
  Matches,
  MinLength,
  MaxLength,
  IsOptional,
  IsIn,
} from "class-validator";

import { ResendOtpReqDTO } from "./auth.dto";
import { UpdatePasswordReqDTO } from "./client.dto";

export class VendorProfileReqDTO {
  @IsOptional()
  @IsString({ message: "First name must be a string" })
  @Matches(/^[A-Za-z]+$/, {
    message: "First name must contain only letters",
  })
  @MinLength(2, { message: "First name must be at least 2 characters" })
  @MaxLength(50, { message: "First name must be less than 50 characters" })
  firstName?: string;

  @IsOptional()
  @IsString({ message: "Last name must be a string" })
  @Matches(/^[A-Za-z]+$/, {
    message: "Last name must contain only letters",
  })
  @MinLength(1, { message: "Last name must be at least 2 characters" })
  @MaxLength(50, { message: "Last name must be less than 50 characters" })
  lastName?: string;

  @IsOptional()
  @IsString({ message: "Phone number must be a string" })
  @Matches(/^[0-9]{10}$/, {
    message: "Phone number must be exactly 10 digits",
  })
  phone?: string;

  @IsOptional()
  @IsString({ message: "Description must be a string" })
  @MinLength(10, { message: "Description must be at least 10 characters" })
  @MaxLength(500, { message: "Description must be less than 500 characters" })
  description?: string;

  @IsOptional()
  @IsString({ message: "Profile image URL must be a string" })
  profileImage?: string;
}


export class ChangeEmailReqDto extends ResendOtpReqDTO{}

export class UpdatePasswordVendorDTO extends UpdatePasswordReqDTO{}

export class UpdateVendorStatusReqDTO {
  @IsString({ message: "Status must be a string" })
  @IsIn(["reviewing"], { message: "Status must be 'reviewing'" })
  status!: "reviewing";
}