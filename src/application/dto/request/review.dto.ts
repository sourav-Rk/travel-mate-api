import { Transform } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

// Allowed target types
export enum REVIEW_TARGET_TYPE {
  PACKAGE = "package",
  GUIDE = "guide",
}

export class AddReviewReqDTO {
  @IsEnum(REVIEW_TARGET_TYPE, { message: "targetType must be either 'package' or 'guide'" })
  targetType!: REVIEW_TARGET_TYPE;

  @Transform(({ value }) => Number(value))
  @IsNumber({}, { message: "rating must be a number" })
  @IsNotEmpty({ message: "rating is required" })
  rating!: number;

  @IsString({ message: "comment must be a string" })
  @IsNotEmpty({ message: "comment is required" })
  comment!: string;

  @IsOptional()
  @IsString({ message: "packageId must be a string" })
  packageId?: string;

  @IsOptional()
  @IsString({ message: "guideId must be a string" })
  guideId?: string;
}
