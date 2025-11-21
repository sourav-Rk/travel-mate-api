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
  MinLength,
  ValidateNested,
} from "class-validator";

import { POST_CATEGORY, POST_STATUS } from "../../../shared/constants";

export class PostLocationDto {
  @IsNotEmpty({ message: "Location type is required" })
  @IsString({ message: "Location type must be a string" })
  type!: string;

  @IsNotEmpty({ message: "Coordinates are required" })
  @IsArray({ message: "Coordinates must be an array" })
  @IsNumber({}, { each: true, message: "Coordinates must be numbers" })
  coordinates!: [number, number]; // [longitude, latitude]

  @IsNotEmpty({ message: "City is required" })
  @IsString({ message: "City must be a string" })
  city!: string;

  @IsNotEmpty({ message: "State is required" })
  @IsString({ message: "State must be a string" })
  state!: string;

  @IsNotEmpty({ message: "Country is required" })
  @IsString({ message: "Country must be a string" })
  country!: string;
}

  export class CreateVolunteerPostReqDTO {
    @IsNotEmpty({ message: "Title is required" })
    @IsString({ message: "Title must be a string" })
    @MinLength(5, { message: "Title must be at least 5 characters" })
    @MaxLength(200, { message: "Title cannot exceed 200 characters" })
    title!: string;

    @IsNotEmpty({ message: "Description is required" })
    @IsString({ message: "Description must be a string" })
    @MinLength(10, { message: "Description must be at least 10 characters" })
    @MaxLength(500, { message: "Description cannot exceed 500 characters" })
    description!: string;

    @IsNotEmpty({ message: "Content is required" })
    @IsString({ message: "Content must be a string" })
    @MinLength(50, { message: "Content must be at least 50 characters" })
    @MaxLength(10000, { message: "Content cannot exceed 10000 characters" })
    content!: string;

    @IsNotEmpty({ message: "Category is required" })
    @IsEnum(POST_CATEGORY, { message: "Category must be a valid post category" })
    category!: (typeof POST_CATEGORY)[keyof typeof POST_CATEGORY];

    @ValidateNested()
    @Type(() => PostLocationDto)
    @IsNotEmpty({ message: "Location is required" })
    location!: PostLocationDto;

    @IsOptional()
    @IsArray({ message: "Images must be an array" })
    @IsString({ each: true, message: "Each image must be a string (URL)" })
    images?: string[];

    @IsOptional()
    @IsArray({ message: "Tags must be an array" })
    @IsString({ each: true, message: "Each tag must be a string" })
    tags?: string[];

    @IsNotEmpty({ message: "offersGuideService is required" })
    @IsBoolean({ message: "offersGuideService must be a boolean value" })
    offersGuideService!: boolean;

  }

export class UpdateVolunteerPostReqDTO {
  @IsOptional()
  @IsString({ message: "Description must be a string" })
  @MinLength(10, { message: "Description must be at least 10 characters" })
  @MaxLength(500, { message: "Description cannot exceed 500 characters" })
  description?: string;

  @IsOptional()
  @IsString({ message: "Content must be a string" })
  @MinLength(50, { message: "Content must be at least 50 characters" })
  @MaxLength(10000, { message: "Content cannot exceed 10000 characters" })
  content?: string;

  @IsOptional()
  @IsArray({ message: "Tags must be an array" })
  @IsString({ each: true, message: "Each tag must be a string" })
  tags?: string[];
}

export class GetVolunteerPostsReqDTO {
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
  @IsEnum(POST_STATUS, { message: "Status must be a valid post status" })
  status?: (typeof POST_STATUS)[keyof typeof POST_STATUS];

  @IsOptional()
  @IsEnum(POST_CATEGORY, { message: "Category must be a valid post category" })
  category!: (typeof POST_CATEGORY)[keyof typeof POST_CATEGORY];

  @IsOptional()
  @IsString({ message: "Local guide profile ID must be a string" })
  localGuideProfileId?: string;

  @IsOptional()
  @IsBoolean({ message: "offersGuideService must be a boolean value" })
  @Transform(({ value }) => {
    if (value === "true") return true;
    if (value === "false") return false;
    return value;
  })
  offersGuideService?: boolean;

  @IsOptional()
  @IsString({ message: "Sort by must be a string" })
  @IsEnum(["newest", "oldest", "views", "likes"], {
    message: "Sort by must be one of: newest, oldest, views, likes",
  })
  sortBy?: "newest" | "oldest" | "views" | "likes";
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

export class GetVolunteerPostsByLocationReqDTO {
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
  
  @Transform(({ value }) => (value ? Number(value) : 10000))
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
  @IsEnum(Object.values(POST_CATEGORY), {
    message: "Category must be a valid post category",
  })
  category?: keyof typeof POST_CATEGORY;

  @IsOptional()
  @IsBoolean({ message: "offersGuideService must be a boolean value" })
  @Transform(({ value }) => {
    if (value === "true") return true;
    if (value === "false") return false;
    return value;
  })
  offersGuideService?: boolean;

  @IsOptional()
  @IsString({ message: "Sort by must be a string" })
  @IsEnum(["newest", "oldest", "views", "likes"], {
    message: "Sort by must be one of: newest, oldest, views, likes",
  })
  sortBy?: "newest" | "oldest" | "views" | "likes";
}

export class SearchVolunteerPostsReqDTO {
  @IsNotEmpty({ message: "Search term is required" })
  @IsString({ message: "Search term must be a string" })
  @MinLength(1, { message: "Search term must be at least 1 characters" })
  searchTerm!: string;

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
  @IsEnum(Object.values(POST_CATEGORY), {
    message: "Category must be a valid post category",
  })
  category?: keyof typeof POST_CATEGORY;

  @IsOptional()
  @IsBoolean({ message: "offersGuideService must be a boolean value" })
  @Transform(({ value }) => {
    if (value === "true") return true;
    if (value === "false") return false;
    return value;
  })
  offersGuideService?: boolean;

  @IsOptional()
  @IsString({ message: "Sort by must be a string" })
  @IsEnum(["newest", "oldest", "views", "likes"], {
    message: "Sort by must be one of: newest, oldest, views, likes",
  })
  sortBy?: "newest" | "oldest" | "views" | "likes";
}
