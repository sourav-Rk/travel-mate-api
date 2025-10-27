import { JwtPayload } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import { IRedisTokenRepository } from "../../../../domain/repositoryInterfaces/redis/redis-token-repository.interface";
import { ITokenService } from "../../../../domain/service-interfaces/token-service.interface";
import { ERROR_MESSAGE } from "../../../../shared/constants";
import { IBlackListTokenUsecase } from "../../interfaces/auth/blacklist-token-usecase.interface";

@injectable()
export class BlackListTokenUsecase implements IBlackListTokenUsecase {
  constructor(
    @inject("IRedisTokenRepository")
    private RedisTokenRepository: IRedisTokenRepository,

    @inject("ITokenService")
    private TokenService: ITokenService
  ) {}

  async execute(token: string): Promise<void> {
    const decoded: string | JwtPayload | null =
      this.TokenService.verifyAccessToken(token);

    if (!decoded || typeof decoded === "string" || !decoded.exp) {
      throw new Error(ERROR_MESSAGE.INVALID_TOKEN_MISSING_EXPIRATION_TIME);
    }

    const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);
    if (expiresIn > 0) {
      await this.RedisTokenRepository.blackListToken(token, expiresIn);
    }
  }
}
