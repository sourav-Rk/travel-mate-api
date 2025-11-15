import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";

import { ROLES } from "../../../shared/constants";

interface IForgotPasswordReset {
  password: string;
  confirmPassword: string;
  token: string;
}

import { Type } from "class-transformer";

export class LoginReqDTO {
  @IsEmail({}, { message: "Invalid email format" })
  @Type(() => String)
  email?: string;

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

  @IsEnum(ROLES, {
    message: `Role must be one of: ${Object.values(ROLES).join(", ")}`,
  })
  @Type(() => String)
  role!: (typeof ROLES)[keyof typeof ROLES];
}

//otp dto
export class OtpReqDTO {
  @IsEmail()
  email?: string;

  @IsString({ message: "OTP must be a string" })
  @Matches(/^\d{6}$/, { message: "OTP must be exactly 6 digits" })
  otp!: string;
}

export class ResendOtpReqDTO {
  @IsEmail()
  email!: string;
}

export class ForgotPasswordSendMailReqDTO extends ResendOtpReqDTO {}

//password validators
@ValidatorConstraint({ name: "passwordMatch", async: false })
class PasswordsMatchConstraint implements ValidatorConstraintInterface {
  validate(confirmPassword: string, args: ValidationArguments) {
    const { password } = args.object as IForgotPasswordReset;
    return password === confirmPassword;
  }

  defaultMessage(args: ValidationArguments) {
    return "Passwords must match";
  }
}

//forgot password req dto
export class ForgotPasswordResetReqDTO {
  @IsString()
  @IsNotEmpty({ message: "Password is required" })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        "Password must contain 8+ characters, uppercase, lowercase, number, and special character",
    }
  )
  password!: string;

  @IsString()
  @IsNotEmpty({ message: "Confirm password is required" })
  @Validate(PasswordsMatchConstraint)
  confirmPassword!: string;

  @IsString()
  @IsNotEmpty({ message: "Token is required" })
  token!: string;
}

export class GoogleSignupReqDTO {
  @IsString()
  @IsNotEmpty({ message: "Google credential is required" })
  credential!: string;

  @IsString()
  @IsNotEmpty({ message: "Client ID is required" })
  client_id!: string;

  @IsEnum(ROLES, {
    message: `Role must be one of: ${Object.values(ROLES).join(", ")}`,
  })
  role!: (typeof ROLES)[keyof typeof ROLES];
}
