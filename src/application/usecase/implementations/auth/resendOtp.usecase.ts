import { inject, injectable } from "tsyringe";

import { IOtpService } from "../../../../domain/service-interfaces/otp-service.interface";
import { IResendOtpUsecase } from "../../interfaces/auth/resendtOtp.interface";
import {
  EVENT_EMMITER_TYPE,
  MAIL_CONTENT_PURPOSE,
} from "../../../../shared/constants";
import { eventBus } from "../../../../shared/eventBus";
import { mailContentProvider } from "../../../../shared/mailContentProvider";
import { ValidationError } from "../../../../domain/errors/validationError";

@injectable()
export class ResendOTPUsecase implements IResendOtpUsecase {
  constructor(
    @inject("IOtpService")
    private _otpService: IOtpService
  ) {}

  async execute(email: string): Promise<void> {
    if (!email) {
      throw new ValidationError("email is required");
    }

    await this._otpService.deleteOtp(email);

    const otp = this._otpService.generateOtp();

    console.log("resend otp : ", otp);

    await this._otpService.storeOtp(email, otp);

    eventBus.emit(
      EVENT_EMMITER_TYPE.SENDMAIL,
      email,
      "Account creation",
      mailContentProvider(MAIL_CONTENT_PURPOSE.OTP, otp)
    );
  }
}
