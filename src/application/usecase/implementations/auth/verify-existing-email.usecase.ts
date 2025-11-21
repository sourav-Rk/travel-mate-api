import { inject, injectable } from "tsyringe";

import { CustomError } from "../../../../domain/errors/customError";
import {
  ERROR_MESSAGE,
  EVENT_EMMITER_TYPE,
  HTTP_STATUS,
  MAIL_CONTENT_PURPOSE,
} from "../../../../shared/constants";
import { eventBus } from "../../../../shared/eventBus";
import { mailContentProvider } from "../../../../shared/mailContentProvider";
import { IOtpService } from "../../../services/interfaces/otp-service.interface";
import { IUserExistenceService } from "../../../services/interfaces/user-existence-service.interface";
import { IVerifyExistingEmail } from "../../interfaces/auth/verify-existing-email-usecase.interface";

@injectable()
export class VerifyExistingEmail implements IVerifyExistingEmail {
  constructor(
    @inject("IOtpService")
    private otpService: IOtpService,

    @inject("IUserExistenceService")
    private userExistenceService: IUserExistenceService
  ) {}

  async execute(email: string): Promise<void> {
    const emailExists = await this.userExistenceService.emailExists(email);

    if (!emailExists) {
      throw new CustomError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_MESSAGE.EMAIL_NOT_FOUND
      );
    }

    const otp = this.otpService.generateOtp();
    await this.otpService.storeOtp(email, otp);
    const html = mailContentProvider(MAIL_CONTENT_PURPOSE.OTP, otp);
    eventBus.emit(EVENT_EMMITER_TYPE.SENDMAIL, email, "Account creation", html);
  }
}
