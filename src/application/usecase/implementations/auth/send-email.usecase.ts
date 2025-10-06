import { inject, injectable } from "tsyringe";

import { IOtpService } from "../../../../domain/service-interfaces/otp-service.interface";
import { IPhoneExistenceService } from "../../../../domain/service-interfaces/phone-existence-service.interface";
import { IUserExistenceService } from "../../../../domain/service-interfaces/user-existence-service.interface";
import { ISendEmailUsecase } from "../../interfaces/auth/send-email-usecase.interface";
import {
  EmailOtpPurpose,
  ERROR_MESSAGE,
  EVENT_EMMITER_TYPE,
  HTTP_STATUS,
  MAIL_CONTENT_PURPOSE,
} from "../../../../shared/constants";
import { eventBus } from "../../../../shared/eventBus";
import { mailContentProvider } from "../../../../shared/mailContentProvider";
import { CustomError } from "../../../../domain/errors/customError";

@injectable()
export class SendEmailUsecase implements ISendEmailUsecase {
  constructor(
    @inject("IOtpService")
    private otpService: IOtpService,

    @inject("IUserExistenceService")
    private userExistenceService: IUserExistenceService,

    @inject("IPhoneExistenceService")
    private phoneExistenceService: IPhoneExistenceService
  ) {}

  async execute(
    email: string,
    phone: string,
    formData: any,
    purpose: EmailOtpPurpose
  ): Promise<void> {
    const emailExists = await this.userExistenceService.emailExists(email);
    if (emailExists) {
      throw new CustomError(HTTP_STATUS.CONFLICT, ERROR_MESSAGE.EMAIL_EXISTS);
    }

    if (purpose === "signup") {
      const phoneExists = await this.phoneExistenceService.phoneExists(phone);

      if (phoneExists) {
        throw new CustomError(
          HTTP_STATUS.CONFLICT,
          ERROR_MESSAGE.PHONE_NUMBER_EXISTS
        );
      }
    }

    await this.otpService.deleteOtp(email);

    const otp = this.otpService.generateOtp();

    console.log(otp);

    await this.otpService.storeOtp(email, otp);

    if (purpose === "signup" && formData) {
      await this.otpService.storeFormData(formData);
    }

    const html = mailContentProvider(MAIL_CONTENT_PURPOSE.OTP, otp);

    eventBus.emit(
      EVENT_EMMITER_TYPE.SENDMAIL,
      email,
      purpose === "signup" ? "Account creation" : "Email change verification",
      html
    );
  }
}
