import { IUserEntity } from "../../entities/user.entity";

export interface IOTPRepository {
  saveOtp(email: string, otp: string): Promise<void>;
  getOtp(
    email: string
  ): Promise<{ otp: string; email: string; createdAt: number } | null>;
  deletOtp(email: string): Promise<void>;
  storeFormDate(data: IUserEntity): Promise<void>;
  getFormData(email: string): Promise<IUserEntity | null>;
  deleteFormData(email: string): Promise<void>;
}
