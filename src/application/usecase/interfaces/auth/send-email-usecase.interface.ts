import { IUserEntity } from "../../../../domain/entities/user.entity";
import { EmailOtpPurpose } from "../../../../shared/constants";

export interface ISendEmailUsecase {
  execute(
    email: string,
    phone: string,
    formData: IUserEntity,
    purpose: EmailOtpPurpose
  ): Promise<void>;
}
