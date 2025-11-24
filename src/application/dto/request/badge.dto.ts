import { Transform, Type } from "class-transformer";
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from "class-validator";

import {
  BadgeCategory,
  BadgeCriteriaType,
} from "../../../domain/entities/badge.entity";

export class BadgeAdditionalConditionDto {
  @IsNotEmpty({ message: "Additional condition type is required" })
  @IsEnum(BadgeCriteriaType, {
    message: "Invalid additional condition type",
  })
  type!: BadgeCriteriaType;

  @IsNotEmpty({ message: "Additional condition value is required" })
  @IsNumber({}, { message: "Additional condition value must be a number" })
  @Min(0, { message: "Additional condition value must be non-negative" })
  value!: number;
}

export class BadgeCriteriaDto {
  @IsNotEmpty({ message: "Criteria type is required" })
  @IsEnum(BadgeCriteriaType, {
    message: "Invalid criteria type",
  })
  type!: BadgeCriteriaType;

  @IsNotEmpty({ message: "Criteria value is required" })
  @IsNumber({}, { message: "Criteria value must be a number" })
  @Min(0, { message: "Criteria value must be non-negative" })
  value!: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => BadgeAdditionalConditionDto)
  additionalCondition?: BadgeAdditionalConditionDto;
}

export class CreateBadgeReqDTO {
  @IsNotEmpty({ message: "Badge ID is required" })
  @IsString({ message: "Badge ID must be a string" })
  @Matches(/^[a-z0-9_-]+$/, {
    message:
      "Badge ID must contain only lowercase letters, numbers, underscores, and hyphens",
  })
  @MaxLength(50, { message: "Badge ID cannot exceed 50 characters" })
  badgeId!: string;

  @IsNotEmpty({ message: "Name is required" })
  @IsString({ message: "Name must be a string" })
  @MaxLength(100, { message: "Name cannot exceed 100 characters" })
  name!: string;

  @IsNotEmpty({ message: "Description is required" })
  @IsString({ message: "Description must be a string" })
  @MaxLength(500, { message: "Description cannot exceed 500 characters" })
  description!: string;

  @IsNotEmpty({ message: "Category is required" })
  @IsEnum(BadgeCategory, {
    message:
      "Invalid category. Must be one of: service, content, engagement, achievement",
  })
  category!: BadgeCategory;

  @IsOptional()
  @IsString({ message: "Icon must be a string" })
  @MaxLength(10, { message: "Icon cannot exceed 10 characters" })
  icon?: string;

  @IsNotEmpty({ message: "Criteria is required" })
  @IsArray({ message: "Criteria must be an array" })
  @ArrayMinSize(1, { message: "At least one criterion is required" })
  @ValidateNested({ each: true })
  @Type(() => BadgeCriteriaDto)
  criteria!: BadgeCriteriaDto[];

  @IsOptional()
  @IsNumber({}, { message: "Priority must be a number" })
  @Min(0, { message: "Priority must be non-negative" })
  @Max(1000, { message: "Priority cannot exceed 1000" })
  priority?: number;
}

export class UpdateBadgeReqDTO {
  @IsOptional()
  @IsString({ message: "Name must be a string" })
  @MaxLength(100, { message: "Name cannot exceed 100 characters" })
  name?: string;

  @IsOptional()
  @IsString({ message: "Description must be a string" })
  @MaxLength(500, { message: "Description cannot exceed 500 characters" })
  description?: string;

  @IsOptional()
  @IsEnum(BadgeCategory, {
    message:
      "Invalid category. Must be one of: service, content, engagement, achievement",
  })
  category?: BadgeCategory;

  @IsOptional()
  @IsString({ message: "Icon must be a string" })
  @MaxLength(10, { message: "Icon cannot exceed 10 characters" })
  icon?: string;

  @IsOptional()
  @IsArray({ message: "Criteria must be an array" })
  @ArrayMinSize(1, { message: "At least one criterion is required" })
  @ValidateNested({ each: true })
  @Type(() => BadgeCriteriaDto)
  criteria?: BadgeCriteriaDto[];

  @IsOptional()
  @IsNumber({}, { message: "Priority must be a number" })
  @Min(0, { message: "Priority must be non-negative" })
  @Max(1000, { message: "Priority cannot exceed 1000" })
  priority?: number;

  @IsOptional()
  @IsBoolean({ message: "isActive must be a boolean" })
  isActive?: boolean;
}

export class GetBadgesReqDTO {
  @IsOptional()
  @Transform(({ value }) => {
    if (value === "true") return true;
    if (value === "false") return false;
    return value;
  })
  @IsBoolean({ message: "isActive must be a boolean" })
  isActive?: boolean;

  @IsOptional()
  @IsEnum(BadgeCategory, {
    message:
      "Invalid category. Must be one of: service, content, engagement, achievement",
  })
  category?: BadgeCategory;

  @IsOptional()
  @IsString({ message: "Search query must be a string" })
  @MaxLength(100, { message: "Search query cannot exceed 100 characters" })
  search?: string;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber({}, { message: "Page must be a number" })
  @Min(1, { message: "Page must be at least 1" })
  page?: number;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber({}, { message: "Limit must be a number" })
  @Min(1, { message: "Limit must be at least 1" })
  @Max(100, { message: "Limit cannot exceed 100" })
  limit?: number;
}
