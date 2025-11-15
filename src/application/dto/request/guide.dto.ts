import { Type } from "class-transformer";
import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";

export class GetGuideDetailsForClientReqDTO {
  @IsString({ message: "guideId must be a string" })
  guideId!: string;
}

export class ResetPasswordGuideDTO {
  @IsString({ message: "Password must be a string" })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        "Password must be at least 8 characters long and include one uppercase letter, one lowercase letter, one number, and one special character",
    }
  )
  @Type(() => String)
  password?: string;

  @IsString()
  @IsNotEmpty({ message: "id is required" })
  id!: string;

  @IsString()
  @IsNotEmpty({ message: "Token is required" })
  token!: string;
}

export class UpdatePasswordGuideReqDTO {
  @IsString()
  @IsNotEmpty({ message: "Password is required" })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        "Password must contain 8+ characters, uppercase, lowercase, number, and special character",
    }
  )
  currentPassword!: string;

  @IsString()
  @IsNotEmpty({ message: "Password is required" })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        "New password must contain 8+ characters, uppercase, lowercase, number, and special character",
    }
  )
  newPassword!: string;
}

export class AddGuideReqDTO {
  @IsString({ message: "First name must be a string" })
  @MinLength(2, { message: "First name must be at least 2 characters" })
  @MaxLength(50, { message: "First name must be less than 50 characters" })
  @IsNotEmpty({ message: "First name is required" })
  firstName!: string;

  @IsString({ message: "Last name must be a string" })
  @MinLength(1, { message: "Last name must be at least 1 character" })
  @MaxLength(50, { message: "Last name must be less than 50 characters" })
  @IsNotEmpty({ message: "Last name is required" })
  lastName!: string;

  @IsEmail({}, { message: "Please enter a valid email address" })
  @IsNotEmpty({ message: "Email is required" })
  email!: string;

  @IsString({ message: "Phone must be a string" })
  @Matches(/^[0-9]{10}$/, { message: "Phone number must be exactly 10 digits" })
  @IsNotEmpty({ message: "Phone number is required" })
  phone!: string;

  @IsString({ message: "Gender must be a string" })
  @IsIn(["male", "female", "other"], {
    message: "Gender must be male, female, or other",
  })
  @IsNotEmpty({ message: "Gender is required" })
  gender!: string;

  @IsDateString({}, { message: "DOB must be a valid date string" })
  @IsNotEmpty({ message: "Date of birth is required" })
  dob!: string;

  @IsString({ message: "Year of experience must be a string" })
  @IsNotEmpty({ message: "Year of experience is required" })
  yearOfExperience!: string;

  @IsArray({ message: "Languages spoken must be an array of strings" })
  @IsString({ each: true, message: "Each language must be a string" })
  @ArrayNotEmpty({ message: "At least one language must be selected" })
  languageSpoken!: string[];

  @IsString({ message: "Alternate phone must be a string" })
  @Matches(/^[0-9]{10}$/, {
    message: "Alternate phone must be exactly 10 digits",
  })
  @IsOptional()
  alternatePhone?: string;

  @IsString({ message: "Role must be a string" })
  @IsIn(["guide"], { message: "Role must be 'guide'" })
  role!: "guide";

  @IsArray({ message: "Documents must be an array of strings" })
  @IsString({ each: true, message: "Each document must be a string" })
  @ArrayNotEmpty({ message: "At least one document is required" })
  documents!: string[];
}
