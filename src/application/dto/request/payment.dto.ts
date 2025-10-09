import { Transform } from "class-transformer";
import { IsNumber, IsString, Min } from "class-validator";

export class BookingPaymentReqDTO {
  @IsString({ message: "bookingId must be a string" })
  bookingId!: string;

  @Transform(({ value }) => Number(value))
  @IsNumber({}, { message: "amount must be a number" })
  @Min(1000, { message: "amount must be greater than or equal to 1000" })
  amount!: number;
}
