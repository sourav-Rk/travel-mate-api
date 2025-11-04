import { inject, injectable } from "tsyringe";

import { ValidationError } from "../../../../domain/errors/validationError";
import { IOtpService } from "../../../services/interfaces/otp-service.interface";
import {
  ERROR_MESSAGE,
  EVENT_EMMITER_TYPE,
  MAIL_CONTENT_PURPOSE,
} from "../../../../shared/constants";
import { eventBus } from "../../../../shared/eventBus";
import { mailContentProvider } from "../../../../shared/mailContentProvider";
import { IResendOtpUsecase } from "../../interfaces/auth/resendtOtp.interface";

@injectable()
export class ResendOTPUsecase implements IResendOtpUsecase {
  constructor(
    @inject("IOtpService")
    private _otpService: IOtpService
  ) {}

  async execute(email: string): Promise<void> {
    if (!email) {
      throw new ValidationError(ERROR_MESSAGE.EMAIL_REQUIRED);
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
