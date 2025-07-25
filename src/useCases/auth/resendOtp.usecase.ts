import { inject, injectable } from "tsyringe";
import { IResendOtpUsecase } from "../../entities/useCaseInterfaces/auth/resendtOtp.interface";
import { IOtpService } from "../../entities/serviceInterfaces/otp-service.interface";
import { ValidationError } from "../../shared/utils/error/validationError";
import { eventBus } from "../../shared/eventBus";
import { EVENT_EMMITER_TYPE, MAIL_CONTENT_PURPOSE } from "../../shared/constants";
import { mailContentProvider } from "../../shared/mailContentProvider";

@injectable()
export class ResendOTPUsecase implements IResendOtpUsecase {
    constructor(
      @inject('IOtpService')
      private _otpService : IOtpService
    ){}

    async execute(email: string): Promise<void> {
        if(!email) {
            throw new ValidationError("email is required");
        }

        await this._otpService.deleteOtp(email);

        const otp = this._otpService.generateOtp();

        console.log("resend otp : ",otp);

        await this._otpService.storeOtp(email,otp);

        eventBus.emit(EVENT_EMMITER_TYPE.SENDMAIL,email,"Account creation",mailContentProvider(MAIL_CONTENT_PURPOSE.OTP,otp));
    }
}