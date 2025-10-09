import {
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsOptional,
} from "class-validator";

export class AddAddressReqDTO {

  @IsString({ message: "Address must be a string" })
  @MinLength(5, { message: "Address must be at least 5 characters" })
  @MaxLength(200, { message: "Address must be less than 200 characters" })
  address?: string;

  @IsString({ message: "Street must be a string" })
  @MinLength(2, { message: "Street must be at least 2 characters" })
  @MaxLength(100, { message: "Street must be less than 100 characters" })
  street?: string;

  @IsString({ message: "City must be a string" })
  @MinLength(2, { message: "City must be at least 2 characters" })
  @MaxLength(50, { message: "City must be less than 50 characters" })
  city?: string;

  @IsString({ message: "State must be a string" })
  @MinLength(2, { message: "State must be at least 2 characters" })
  @MaxLength(50, { message: "State must be less than 50 characters" })
  state?: string;

  @IsString({ message: "Pincode must be a string" })
  @Matches(/^[0-9]{6}$/, {
    message: "Pincode must be exactly 6 digits",
  })
  pincode?: string;

  @IsString({ message: "Country must be a string" })
  @MinLength(2, { message: "Country must be at least 2 characters" })
  @MaxLength(50, { message: "Country must be less than 50 characters" })
  country?: string;
}


export class UpdateAddressReqDTO {
  @IsOptional()
  @IsString({ message: "Address must be a string" })
  @MinLength(5, { message: "Address must be at least 5 characters" })
  @MaxLength(200, { message: "Address must be less than 200 characters" })
  address?: string;

  @IsOptional()
  @IsString({ message: "Street must be a string" })
  @MinLength(2, { message: "Street must be at least 2 characters" })
  @MaxLength(100, { message: "Street must be less than 100 characters" })
  street?: string;

  @IsOptional()
  @IsString({ message: "City must be a string" })
  @MinLength(2, { message: "City must be at least 2 characters" })
  @MaxLength(50, { message: "City must be less than 50 characters" })
  city?: string;

  @IsOptional()
  @IsString({ message: "State must be a string" })
  @MinLength(2, { message: "State must be at least 2 characters" })
  @MaxLength(50, { message: "State must be less than 50 characters" })
  state?: string;

  @IsOptional()
  @IsString({ message: "Pincode must be a string" })
  @Matches(/^[0-9]{6}$/, {
    message: "Pincode must be exactly 6 digits",
  })
  pincode?: string;

  @IsOptional()
  @IsString({ message: "Country must be a string" })
  @MinLength(2, { message: "Country must be at least 2 characters" })
  @MaxLength(50, { message: "Country must be less than 50 characters" })
  country?: string;
}
