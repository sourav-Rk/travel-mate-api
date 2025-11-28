import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, IsEnum, Length } from "class-validator";

// Optional gender enum
export enum GENDER {
  MALE = "Male",
  FEMALE = "Female",
  OTHER = "Other",
}

export class UpdateClientProfileDTO {
  @IsOptional()
  @IsString({ message: "First name must be a string" })
  @Matches(/^[A-Za-z]+$/, { message: "First name must contain only letters" })
  @Length(2, 50, { message: "First name must be at least 2 characters" })
  firstName?: string;

  @IsOptional()
  @IsString({ message: "Last name must be a string" })
  @Matches(/^[A-Za-z]+$/, { message: "Last name must contain only letters" })
  @Length(1, 50, { message: "Last name must be at least 1 characters" })

  lastName?: string;

  @IsOptional()
  @IsEmail({}, { message: "Please enter a valid email address" })
  email?: string;

  @IsOptional()
  @Matches(/^\+?[\d\s-()]{10,}$/, { message: "Please enter a valid phone number with at least 10 digits" })
  phone?: string;

  @IsOptional()
  @IsEnum(GENDER, { message: "Please select a valid gender" })
  gender?: GENDER;

  @IsOptional()
  @IsString({ message: "Bio must be a string" })
  bio?: string;

  @IsOptional()
  @IsString()
  profileImage?: string;
}


export class UpdatePasswordReqDTO {
  @IsNotEmpty({ message: "Current password is required" })
  @IsString({ message: "Current password must be a string" })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    { message: "Current password must contain 8+ characters, uppercase, lowercase, number, and special character" }
  )
  currentPassword!: string;

  @IsNotEmpty({ message: "New password is required" })
  @IsString({ message: "New password must be a string" })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    { message: "New password must contain 8+ characters, uppercase, lowercase, number, and special character" }
  )
  newPassword!: string;
}

