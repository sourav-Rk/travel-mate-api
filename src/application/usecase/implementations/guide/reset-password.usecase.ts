import { JwtPayload } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import { IGuideRepository } from "../../../../domain/repositoryInterfaces/guide/guide-repository.interface";
import { IRedisTokenRepository } from "../../../../domain/repositoryInterfaces/redis/redis-token-repository.interface";
import { ITokenService } from "../../../../domain/service-interfaces/token-service.interface";
import { IResetPasswordUsecase } from "../../interfaces/guide/reset-password-usecase.interface";
import { HTTP_STATUS } from "../../../../shared/constants";
import { hashPassword } from "../../../../shared/utils/bcryptHelper";
import { CustomError } from "../../../../domain/errors/customError";
import { NotFoundError } from "../../../../domain/errors/notFoundError";

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
    console.log("token in reset", token);
    const decoded: string | JwtPayload | null =
      this._tokenService.verifyResetToken(token);

    if (!decoded || typeof decoded === "string" || !decoded.exp) {
      throw new Error("Invalid Token: Missing expiration time");
    }

    if (decoded.id !== guideId) {
      throw new Error("Token does not match the user");
    }

    if (!guideId) throw new NotFoundError("user not found");

    if (!password || password.length < 8) {
      throw new CustomError(
        HTTP_STATUS.BAD_REQUEST,
        "password must be 8 characters long"
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
