import { Type } from "class-transformer";
import { IsString, IsNotEmpty, IsOptional, IsInt, Min, IsDateString } from "class-validator";

export class GetMessagesReqDto {
  @IsString()
  @IsNotEmpty()
  chatroomId!: string;

  @IsInt()
  @Type(() => Number) // transforms string to number
  @Min(1)
  limit!: number;

  @IsOptional()
  @IsDateString()
  before?: string; // ISO date string
}
