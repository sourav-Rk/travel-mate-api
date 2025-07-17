import { inject, injectable } from "tsyringe";
import { IOtpService } from "../../entities/serviceInterfaces/otp-service.interface";
import { IOTPRepository } from "../../entities/repositoryInterfaces/auth/otp-repository.interface";
import { IUserEntity } from "../../entities/modelsEntity/user.entity";

@injectable()
export class OtpService implements IOtpService {
  constructor(
    @inject("IOTPRepository")
    private _OTPRepository: IOTPRepository
  ) {}

  generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async storeOtp(email: string, otp: string): Promise<void> {
    await this._OTPRepository.saveOtp(email, otp);
  }

  async verifyOtp({
    email,
    otp,
  }: {
    email: string;
    otp: string;
  }): Promise<boolean> {
    const storedOtp = await this._OTPRepository.getOtp(email);

    if (!storedOtp) return false;

    const now = Date.now();
    const createdAt = storedOtp.createdAt;

    //checking otp is valod
    const isWithinOneMinute = now - createdAt <= 60 * 1000;
    if (!isWithinOneMinute) return false;

    return storedOtp.otp === otp;
  }

  async storeFormData(data: IUserEntity): Promise<void> {
      await this._OTPRepository.storeFormDate(data);
  }

  async getFormData(email: string): Promise<IUserEntity | null> {
      const data = await this._OTPRepository.getFormData(email);
      return data ? data : null
  }

  async deleteOtp(email: string): Promise<void> {
      await this._OTPRepository.deletOtp(email)
  }

  
}
