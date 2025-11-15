import { Transform } from "class-transformer";
import {
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  IsNotEmpty,
  IsIn,
} from "class-validator";

export enum SORT_BY {
  PRICE_HIGH = "price-high",
  PRICE_LOW = "price-low",
  DAYS_SHORT = "days-short",
  DAYS_LONG = "days-long",
  POPULAR = "popular",
}

export enum PACKAGE_CATEGORY {
  ADVENTURE = "Adventure",
  CULTURAL = "Cultural",
  NATURE = "Nature",
  BEACH = "Beach",
  MOUNTAIN = "Mountain",
  WILDLIFE = "Wildlife",
  HERITAGE = "Heritage",
}

export enum PACKAGE_STATUS {
  ONGOING = "ongoing",
  COMPLETED = "completed",
}

export enum PackageStatus {
  ALL = "all",
  DRAFT = "draft",
  ACTIVE = "active",
  APPLICATIONS_CLOSED = "applications_closed",
  ONGOING = "ongoing",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}


export class GetAvailablePackagesReqDTO {
  @IsOptional()
  @Transform(({ value }) =>
    value !== undefined && value !== "" ? Number(value) : undefined
  )
  @IsNumber({}, { message: "page must be a number" })
  @Min(1, { message: "page must be at least 1" })
  page?: number;

  @IsOptional()
  @Transform(({ value }) =>
    value !== undefined && value !== "" ? Number(value) : undefined
  )
  @IsNumber({}, { message: "limit must be a number" })
  @Min(1, { message: "limit must be at least 1" })
  limit?: number;

  @IsOptional()
  @Transform(({ value }) => (value !== "" ? value : undefined))
  @IsString({ message: "search must be a string" })
  search?: string;

  @IsOptional()
  @IsArray({ message: "priceRange must be an array of two numbers" })
  @ArrayMinSize(2, { message: "priceRange must contain exactly 2 values" })
  @ArrayMaxSize(2, { message: "priceRange must contain exactly 2 values" })
  @Transform(({ value }) =>
    value
      ? Array.isArray(value)
        ? value.map((v: string) => Number(v))
        : [Number(value)]
      : undefined
  )
  @IsNumber({}, { each: true, message: "priceRange values must be numbers" })
  priceRange?: number[];

  @IsOptional()
  @Transform(({ value }) => (value !== "" ? value : undefined))
  @IsEnum(["1-3", "4-7", "8-14", "15-21", "22+"], {
    message: "duration must be one of: 1-3, 4-7, 8-14, 15-21, 22+",
  })
  duration?: string;

  // Handle categories as single string or array
  @IsOptional()
  @IsArray({ message: "categories must be an array" })
  @IsEnum(PACKAGE_CATEGORY, {
    each: true,
    message:
      "categories must be one or more of: Adventure, Cultural, Nature, Beach, Mountain, Wildlife, Heritage",
  })
  @Transform(({ value }) => {
    if (value === "" || value === null || value === undefined) {
      return undefined;
    }

    if (Array.isArray(value)) {
      return value;
    }

    // if it's a single string (not empty), wrap it in an array
    return [value];
  })
  categories?: PACKAGE_CATEGORY[];
}

export class GetAssignedPackagesReqDTO {
  @IsOptional()
  @IsString({ message: "searchTerm must be a string" })
  searchTerm?: string;

  @IsOptional()
  @IsString({ message: "status must be a string" })
  status?: string;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber({}, { message: "page must be a number" })
  @Min(1, { message: "page must be at least 1" })
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber({}, { message: "limit must be a number" })
  @Min(1, { message: "limit must be at least 1" })
  limit?: number = 10;
}

export class UpdatePackageStatusReqDTO {
  @IsString({ message: "packageId must be a string" })
  @IsNotEmpty({ message: "packageId is required" })
  packageId!: string;

  @IsEnum(PACKAGE_STATUS, {
    message: "status must be either 'ongoing' or 'completed'",
  })
  status!: PACKAGE_STATUS;
}


export class GetPackagesVendorReqDTO {
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
  @IsEnum(PackageStatus, {
    message:
      "status must be one of draft, active, applications_closed, ongoing, completed, or cancelled",
  })
  status?: PackageStatus;

  @IsOptional()
  @IsString({ message: "category must be a string" })
  category?: string;

  @IsString({ message: "userType must be a string" })
  @IsIn(["vendor"], { message: "userType must be 'vendor'" })
  userType!: "vendor";
}