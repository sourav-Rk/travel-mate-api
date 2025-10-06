import { injectable } from "tsyringe";

import { IRedisTokenRepository } from "../../../domain/repositoryInterfaces/redis/redis-token-repository.interface";
import redisClient from "../../config/redis/redisClient.config";

@injectable()
export class RedisTokenRepository implements IRedisTokenRepository {
  async blackListToken(token: string, expiresIn: number): Promise<void> {
    await redisClient.set(token, "blacklisted", { EX: expiresIn });
  }

  async isTokenBlackListed(token: string): Promise<boolean> {
    const result = await redisClient.get(token);
    return result === "blacklisted";
  }
}
