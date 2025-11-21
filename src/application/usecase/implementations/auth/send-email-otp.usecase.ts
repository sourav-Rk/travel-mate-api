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
import { ISendEmailOtpUsecase } from "../../interfaces/auth/send-email-otp-usecase.interface";

@injectable()
export class SendEmailOtpUsecase implements ISendEmailOtpUsecase {
  constructor(
    @inject("IUserExistenceService")
    private _userExistenceService: IUserExistenceService,

    @inject("IOtpService")
    private _otpService: IOtpService
  ) {}

  async execute(email: string): Promise<void> {
    if (!email)
      throw new CustomError(
        HTTP_STATUS.BAD_REQUEST,
        ERROR_MESSAGE.EMAIL_REQUIRED
      );

    const userExist = await this._userExistenceService.emailExists(email);

    if (userExist) {
      throw new CustomError(HTTP_STATUS.CONFLICT, ERROR_MESSAGE.EMAIL_EXISTS);
    }

    const otp = this._otpService.generateOtp();

    console.log(otp);

    await this._otpService.storeOtp(email, otp);

    eventBus.emit(
      EVENT_EMMITER_TYPE.SENDMAIL,
      email,
      "Email change verification",
      mailContentProvider(MAIL_CONTENT_PURPOSE.EMAIL_CHANGE, otp)
    );
  }
}
