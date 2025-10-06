import { EmailOtpPurpose } from "../../../../shared/constants";

export interface ISendEmailUsecase {
  execute(
    email: string,
    phone: string,
    formData: any,
    purpose: EmailOtpPurpose
  ): Promise<void>;
}
