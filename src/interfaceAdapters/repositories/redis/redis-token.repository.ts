import { injectable } from "tsyringe";

import { IRedisTokenRepository } from "../../../entities/repositoryInterfaces/redis/redis-token-repository.interface";
import redisClient from "../../../frameworks/redis/redisClient";

@injectable()
export class RedisTokenRepository implements IRedisTokenRepository{
    async blackListToken(token: string, expiresIn: number): Promise<void> {
        await redisClient.set(token,"blacklisted",{EX : expiresIn});
    }

    async isTokenBlackListed(token: string): Promise<boolean> {
        const result = await redisClient.get(token);
        return result ==="blacklisted"
    }
}