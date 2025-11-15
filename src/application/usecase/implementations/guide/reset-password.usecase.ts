import { JwtPayload } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import { CustomError } from "../../../../domain/errors/customError";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { IGuideRepository } from "../../../../domain/repositoryInterfaces/guide/guide-repository.interface";
import { IRedisTokenRepository } from "../../../../domain/repositoryInterfaces/redis/redis-token-repository.interface";
import { ITokenService } from "../../../../domain/service-interfaces/token-service.interface";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../../../shared/constants";
import { hashPassword } from "../../../../shared/utils/bcryptHelper";
import { IResetPasswordUsecase } from "../../interfaces/guide/reset-password-usecase.interface";

@injectable()
export class ResetPasswordUsecase implements IResetPasswordUsecase {
  constructor(
    @inject("IGuideRepository")
    private _guideRepository: IGuideRepository,

    @inject("ITokenService")
    private _tokenService: ITokenService,

    @inject("IRedisTokenRepository")
    private _redisTokenRepository: IRedisTokenRepository
  ) {}

  async execute(
    guideId: string,
    password: string,
    token: string
  ): Promise<void> {
   
    const decoded: string | JwtPayload | null =
      this._tokenService.verifyResetToken(token);

    if (!decoded || typeof decoded === "string" || !decoded.exp) {
      throw new Error(ERROR_MESSAGE.INVALID_TOKEN_MISSING_EXPIRATION_TIME);
    }

    if (decoded.id !== guideId) {
      throw new Error(ERROR_MESSAGE.TOKENS_DOES_NOT_MATCH_THE_USER);
    }

    if (!guideId) throw new NotFoundError(ERROR_MESSAGE.USER_NOT_FOUND);

    if (!password || password.length < 8) {
      throw new CustomError(
        HTTP_STATUS.BAD_REQUEST,
        ERROR_MESSAGE.PASSWORD_MUST_BE_EIGHT_CHARACTER_LONG
      );
    }

    const hashedPassword = await hashPassword(password);
    await this._guideRepository.findByIdAndUpdatePassword(
      guideId,
      hashedPassword
    );

    const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);
    if (expiresIn > 0) {
      await this._redisTokenRepository.blackListToken(token, expiresIn);
    }
  }
}
