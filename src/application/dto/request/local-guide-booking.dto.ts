import { Type } from "class-transformer";
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from "class-validator";

export class QuoteLocationDto {
  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;
}

export class CreateQuoteDto {
  @IsString()
  @IsNotEmpty()
  guideChatRoomId!: string;

  @IsDateString()
  @IsNotEmpty()
  sessionDate!: string; // ISO date string

  @IsString()
  @IsNotEmpty()
  sessionTime!: string; // HH:mm format

  @IsNumber()
  @Min(0.5)
  hours!: number;

  @ValidateNested()
  @Type(() => QuoteLocationDto)
  @IsOptional()
  location?: QuoteLocationDto;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class AcceptQuoteDto {
  @IsString()
  @IsNotEmpty()
  quoteId!: string;
}

export class DeclineQuoteDto {
  @IsString()
  @IsNotEmpty()
  quoteId!: string;

  @IsOptional()
  @IsString()
  reason?: string;
}

















