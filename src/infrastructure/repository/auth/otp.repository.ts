import { injectable } from "tsyringe";

import { IUserEntity } from "../../../domain/entities/user.entity";
import { IOTPRepository } from "../../../domain/repositoryInterfaces/auth/otp-repository.interface";
import redisClient from "../../config/redis/redisClient.config";

@injectable()
export class OTPRepository implements IOTPRepository {
  async saveOtp(email: string, otp: string): Promise<void> {
    const payload = {
      otp,
      email,
      createdAt: Date.now(),
    };
    await redisClient.set(`otp:${email}`, JSON.stringify(payload), { EX: 60 });
  }

  async getOtp(
    email: string
  ): Promise<{ otp: string; email: string; createdAt: number } | null> {
    const data = await redisClient.get(`otp:${email}`);
    if (!data) return null;
    return JSON.parse(data);
  }

  async deletOtp(email: string): Promise<void> {
    await redisClient.del(`otp:${email}`);
  }

  async storeFormDate(data: IUserEntity): Promise<void> {
    await redisClient.set(`signup:${data.email}`, JSON.stringify(data), {
      EX: 180,
    });
  }

  async getFormData(email: string): Promise<IUserEntity | null> {
    const key = `signup:${email}`;
    console.log("Fetching Redis key:", key);

    const data = await redisClient.get(key);

    if (!data) {
      console.warn("No data found in Redis for key:", key);
      return null;
    }

    try {
      console.log(JSON.parse(data));
      return JSON.parse(data);
    } catch (err) {
      console.error("Failed to parse Redis data:", err);
      return null;
    }
  }

  async deleteFormData(email: string): Promise<void> {
    await redisClient.del(`signup:${email}`);
  }
}
