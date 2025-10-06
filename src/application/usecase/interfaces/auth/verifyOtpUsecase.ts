import { ISuccessResponseHandler } from "../../../../shared/utils/successResponseHandler";

export interface IVerifyOtpUsecase {
  execute(email: string, otp: string): Promise<ISuccessResponseHandler>;
}
