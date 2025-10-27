import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsString,
  Matches,
} from "class-validator";


export class AddKycReqDTO {
  @IsNotEmpty({ message: "PAN number is required" })
  @IsString({ message: "PAN number must be a string" })
  @Matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, {
    message: "Invalid PAN format",
  })
  pan!: string;

  @IsNotEmpty({ message: "GSTIN is required" })
  @IsString({ message: "GSTIN must be a string" })
  @Matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, {
    message: "Invalid GSTIN format",
  })
  gstin!: string;

  @IsNotEmpty({ message: "Registration number is required" })
  @IsString({ message: "Registration number must be a string" })
  registrationNumber!: string;

  @IsArray({ message: "Documents must be an array" })
  @ArrayMinSize(3, { message: "At least 3 documents are required" })
  @ArrayMaxSize(3, { message: "Only 3 documents are allowed" })
  @IsString({ each: true, message: "Each document must be a string" })
  documents!: string[];
}
