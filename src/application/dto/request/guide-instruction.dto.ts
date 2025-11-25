import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsObject,
  ValidateNested,
  MaxLength,
  MinLength,
} from 'class-validator';

import { CoordinatesDto } from './coordinates.dto';

export class LocationDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  name!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(200)
  address!: string;

  @IsObject()
  @ValidateNested()
  @Type(() => CoordinatesDto)
  coordinates!: CoordinatesDto;
}

export class CreateInstructionDto {
  @IsString()
  @IsNotEmpty()
  packageId!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(100)
  title!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(2000)
  message!: string;

  @IsEnum([
    'MEETING_POINT',
    'ITINERARY_UPDATE', 
    'SAFETY_INFO',
    'REMINDER',
    'GENERAL'
  ])
  type!: 'MEETING_POINT' | 'ITINERARY_UPDATE' | 'SAFETY_INFO' | 'REMINDER' | 'GENERAL';

  @IsOptional()
  @IsEnum(['LOW', 'MEDIUM', 'HIGH', 'URGENT'])
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => LocationDto)
  location?: LocationDto;
}