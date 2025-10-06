import { IUserEntity } from "../entities/user.entity";

export interface IOtpService {
  generateOtp(): string;
  deleteOtp(email: string): Promise<void>;
  storeOtp(email: string, otp: string): Promise<void>;
  verifyOtp({ email, otp }: { email: string; otp: string }): Promise<boolean>;
  storeFormData(data: IUserEntity): Promise<void>;
  getFormData(email: string): Promise<IUserEntity | null>;
}
