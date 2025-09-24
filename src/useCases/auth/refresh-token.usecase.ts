import { JwtPayload } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import { ITokenService } from "../../entities/serviceInterfaces/token-service.interface";
import { IRefreshTokenUsecase } from "../../entities/useCaseInterfaces/auth/refresh-token-usecase.interface";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../shared/constants";
import { CustomError } from "../../shared/utils/error/customError";
import { ITokenRepository } from "../../entities/repositoryInterfaces/token/token-repository.interface";

@injectable()
export class RefreshTokenUsecase implements IRefreshTokenUsecase {
  constructor(
    @inject("ITokenService")
    private _tokenService: ITokenService,

    @inject("ITokenRepository")
    private _tokenRepository: ITokenRepository
  ) {}

  async execute(
    refreshToken: string
  ): Promise<{ role: string; accessToken: string }> {
    const payload = this._tokenService.verifyRefreshToken(refreshToken);

    if (!payload) {
      throw new CustomError(
        HTTP_STATUS.BAD_REQUEST,
        ERROR_MESSAGE.TOKEN_EXPIRED_REFRESH
      );
    }

    const isValid = await this._tokenRepository.tokenExists(
      refreshToken,
      (payload as JwtPayload).id
    );

    if (!isValid) {
      throw new CustomError(
        HTTP_STATUS.FORBIDDEN,
        ERROR_MESSAGE.TOKEN_EXPIRED_REFRESH
      );
    }

    const newPayload = {
      id: payload.id,
      email: payload.email,
      role: payload.role,
    };

    const accessToken = this._tokenService.generateAccessToken(newPayload);

    return { role: payload.role, accessToken };
  }
}
