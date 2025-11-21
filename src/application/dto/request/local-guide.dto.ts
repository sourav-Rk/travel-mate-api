import { Transform, Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from "class-validator";

import {
  GUIDE_SPECIALTIES,
  VERIFICATION_STATUS,
} from "../../../shared/constants";

export class LocationDto {
  @IsNotEmpty({ message: "Coordinates are required" })
  @IsArray({ message: "Coordinates must be an array" })
  @IsNumber({}, { each: true, message: "Coordinates must be numbers" })
  coordinates!: [number, number]; // [longitude, latitude]

  @IsNotEmpty({ message: "City is required" })
  @IsString({ message: "City must be a string" })
  city!: string;

  @IsOptional()
  @IsString({ message: "Address must be a string" })
  type?: string;

  @IsNotEmpty({ message: "State is required" })
  @IsString({ message: "State must be a string" })
  state!: string;

  @IsNotEmpty({ message: "Country is required" })
  @IsString({ message: "Country must be a string" })
  country!: string;

  @IsOptional()
  @IsString({ message: "Address must be a string" })
  @MaxLength(500, { message: "Address cannot exceed 500 characters" })
  address?: string;

  @IsOptional()
  @IsString({ message: "Formatted address must be a string" })
  @MaxLength(500, { message: "Formatted address cannot exceed 500 characters" })
  formattedAddress?: string;
}

export class RequestLocalGuideVerificationReqDTO {
  @IsNotEmpty({ message: "ID proof is required" })
  @IsString({ message: "ID proof must be a string (URL)" })
  idProof!: string;

  @IsNotEmpty({ message: "Address proof is required" })
  @IsString({ message: "Address proof must be a string (URL)" })
  addressProof!: string;

  @IsOptional()
  @IsArray({ message: "Additional documents must be an array" })
  @IsString({ each: true, message: "Each document must be a string (URL)" })
  additionalDocuments?: string[];

  @ValidateNested()
  @Type(() => LocationDto)
  @IsNotEmpty({ message: "Location is required" })
  location!: LocationDto;

  @IsOptional()
  @IsNumber({}, { message: "Hourly rate must be a number" })
  @Min(0, { message: "Hourly rate must be at least 0" })
  @Max(10000, { message: "Hourly rate cannot exceed 10000" })
  hourlyRate?: number;

  @IsNotEmpty({ message: "At least one language is required" })
  @IsArray({ message: "Languages must be an array" })
  @IsString({ each: true, message: "Each language must be a string" })
  languages!: string[];

  @IsOptional()
  @IsArray({ message: "Specialties must be an array" })
  @IsEnum(GUIDE_SPECIALTIES, {
    each: true,
    message: "Each specialty must be a valid guide specialty",
  })
  specialties?: string[];

  @IsOptional()
  @IsString({ message: "Bio must be a string" })
  @MaxLength(1000, { message: "Bio cannot exceed 1000 characters" })
  bio?: string;

  @IsOptional()
  @IsString({ message: "Profile image must be a string (URL)" })
  profileImage?: string;

  @IsOptional()
  @IsString({ message: "Availability not must be a string" })
  availabilityNote?: string;

  @IsOptional()
  @IsBoolean({ message: "isAvailable must be a boolean value" })
  isAvailable?: boolean;
}

export class UpdateLocalGuideVerificationStatusReqDTO {
  @IsNotEmpty({ message: "Profile ID is required" })
  @IsString({ message: "Profile ID must be a string" })
  profileId!: string;

  @IsNotEmpty({ message: "Status is required" })
  @IsEnum(VERIFICATION_STATUS, {
    message: "Status must be a valid verification status",
  })
  status!: keyof typeof VERIFICATION_STATUS;

  @IsOptional()
  @IsString({ message: "Rejection reason must be a string" })
  rejectionReason?: string;
}

export class GetPendingVerificationsReqDTO {
  @Transform(({ value }) => (value ? Number(value) : 1))
  @IsOptional()
  @IsNumber({}, { message: "Page must be a number" })
  @Min(1, { message: "Page must be at least 1" })
  page?: number = 1;

  @Transform(({ value }) => (value ? Number(value) : 10))
  @IsOptional()
  @IsNumber({}, { message: "Limit must be a number" })
  @Min(1, { message: "Limit must be at least 1" })
  limit?: number = 10;

  @IsOptional()
  @IsEnum(VERIFICATION_STATUS, {
    message: "Status must be a valid verification status",
  })
  status?: keyof typeof VERIFICATION_STATUS;

  @IsOptional()
  @IsString({ message: "Search term must be a string" })
  searchTerm?: string;
}

export class UpdateLocalGuideAvailabilityReqDTO {
  @IsNotEmpty({ message: "isAvailable is required" })
  @IsBoolean({ message: "isAvailable must be a boolean value" })
  isAvailable!: boolean;

  @IsOptional()
  @IsString({ message: "Availability note must be a string" })
  @MaxLength(500, { message: "Availability note cannot exceed 500 characters" })
  availabilityNote?: string;
}

export class UpdateLocalGuideProfileReqDTO {
  @ValidateNested()
  @Type(() => LocationDto)
  @IsOptional()
  location?: LocationDto;

  @IsOptional()
  @IsNumber({}, { message: "Hourly rate must be a number" })
  @Min(0, { message: "Hourly rate must be at least 0" })
  @Max(10000, { message: "Hourly rate cannot exceed 10000" })
  hourlyRate?: number;

  @IsOptional()
  @IsArray({ message: "Languages must be an array" })
  @IsString({ each: true, message: "Each language must be a string" })
  languages?: string[];

  @IsOptional()
  @IsArray({ message: "Specialties must be an array" })
  @IsEnum(GUIDE_SPECIALTIES, {
    each: true,
    message: "Each specialty must be a valid guide specialty",
  })
  specialties?: string[];

  @IsOptional()
  @IsString({ message: "Bio must be a string" })
  @MaxLength(1000, { message: "Bio cannot exceed 1000 characters" })
  bio?: string;

  @IsOptional()
  @IsString({ message: "Profile image must be a string (URL)" })
  profileImage?: string;

  @IsOptional()
  @IsBoolean({ message: "isAvailable must be a boolean value" })
  isAvailable?: boolean;

  @IsOptional()
  @IsString({ message: "Availability note must be a string" })
  @MaxLength(500, { message: "Availability note cannot exceed 500 characters" })
  availabilityNote?: string;
}

export class BoundingBoxDto {
  @Transform(({ value }) => value ? Number(value) : 1)
  @IsNotEmpty({ message: "North coordinate is required" })
  @IsNumber({}, { message: "North must be a number" })
  @Min(-90, { message: "North must be between -90 and 90" })
  @Max(90, { message: "North must be between -90 and 90" })
  north!: number;
  
  @Transform(({ value }) => value ? Number(value) : 1)
  @IsNotEmpty({ message: "South coordinate is required" })
  @IsNumber({}, { message: "South must be a number" })
  @Min(-90, { message: "South must be between -90 and 90" })
  @Max(90, { message: "South must be between -90 and 90" })
  south!: number;
  
  @Transform(({ value }) => value ? Number(value) : 1)
  @IsNotEmpty({ message: "East coordinate is required" })
  @IsNumber({}, { message: "East must be a number" })
  @Min(-180, { message: "East must be between -180 and 180" })
  @Max(180, { message: "East must be between -180 and 180" })
  east!: number;

  @Transform(({ value }) => value ? Number(value) : 1)
  @IsNotEmpty({ message: "West coordinate is required" })
  @IsNumber({}, { message: "West must be a number" })
  @Min(-180, { message: "West must be between -180 and 180" })
  @Max(180, { message: "West must be between -180 and 180" })
  west!: number;
}

export class GetLocalGuidesByLocationReqDTO {
  @Transform(({ value }) => value ? Number(value) : 1)
  @IsOptional()
  @IsNumber({}, { message: "Page must be a number" })
  @Min(1, { message: "Page must be at least 1" })
  page?: number = 1;

  @Transform(({ value }) => value ? Number(value) : 10)
  @IsOptional()
  @IsNumber({}, { message: "Limit must be a number" })
  @Min(1, { message: "Limit must be at least 1" })
  limit?: number = 10;
  
  @Transform(({ value }) => value ? Number(value) : undefined)
  @IsOptional()
  @IsNumber({}, { message: "Longitude must be a number" })
  @Min(-180, { message: "Longitude must be between -180 and 180" })
  @Max(180, { message: "Longitude must be between -180 and 180" })
  longitude?: number;
  
  @Transform(({ value }) => value ? Number(value) : undefined)
  @IsOptional()
  @IsNumber({}, { message: "Latitude must be a number" })
  @Min(-90, { message: "Latitude must be between -90 and 90" })
  @Max(90, { message: "Latitude must be between -90 and 90" })
  latitude?: number;

  @Transform(({ value }) => value ? Number(value) : 10000)
  @IsOptional()
  @IsNumber({}, { message: "Radius must be a number" })
  @Min(100, { message: "Radius must be at least 100 meters" })
  @Max(50000, { message: "Radius cannot exceed 50000 meters" })
  radiusInMeters?: number = 10000;

  @IsOptional()
  @ValidateNested()
  @Type(() => BoundingBoxDto)
  boundingBox?: BoundingBoxDto;

  @IsOptional()
  @IsBoolean({ message: "isAvailable must be a boolean value" })
  @Transform(({ value }) => {
    if (value === "true") return true;
    if (value === "false") return false;
    return value;
  })
  isAvailable?: boolean;

  @IsOptional()
  @IsArray({ message: "Specialties must be an array" })
  @IsEnum(GUIDE_SPECIALTIES, {
    each: true,
    message: "Each specialty must be a valid guide specialty",
  })
  @Transform(({ value }) => {
    if (typeof value === 'string') return value.split(',');
    return value;
  })
  specialties?: string[];

  @Transform(({ value }) => value ? Number(value) : undefined)
  @IsOptional()
  @IsNumber({}, { message: "Min rating must be a number" })
  @Min(0, { message: "Min rating must be at least 0" })
  @Max(5, { message: "Min rating cannot exceed 5" })
  minRating?: number;
}