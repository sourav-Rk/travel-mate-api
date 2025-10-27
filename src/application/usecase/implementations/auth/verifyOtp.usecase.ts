import { inject, injectable } from "tsyringe";

import { ValidationError } from "../../../../domain/errors/validationError";
import { IOtpService } from "../../../../domain/service-interfaces/otp-service.interface";
import { ERROR_MESSAGE, HTTP_STATUS, SUCCESS_MESSAGE } from "../../../../shared/constants";
import {
  ISuccessResponseHandler,
  successResponseHandler,
} from "../../../../shared/utils/successResponseHandler";
import { IVerifyOtpUsecase } from "../../interfaces/auth/verifyOtpUsecase";

@injectable()
export class VerifyOtpUsecase implements IVerifyOtpUsecase {
  constructor(
    @inject("IOtpService")
    private _IOtpService: IOtpService
  ) {}

  async execute(email: string, otp: string): Promise<ISuccessResponseHandler> {
    const isOtpValid = await this._IOtpService.verifyOtp({ email, otp });

    if (!isOtpValid) {
      throw new ValidationError(ERROR_MESSAGE.INVALID_OTP);
    }

    return successResponseHandler(
      true,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.OTP_VERIFIED
    );
  }
}
