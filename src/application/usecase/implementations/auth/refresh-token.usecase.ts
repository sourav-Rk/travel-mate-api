import { inject, injectable } from "tsyringe";

import { CustomError } from "../../../../domain/errors/customError";
import { ITokenService } from "../../../../domain/service-interfaces/token-service.interface";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../../../shared/constants";
import { IRefreshTokenUsecase } from "../../interfaces/auth/refresh-token-usecase.interface";

@injectable()
export class RefreshTokenUsecase implements IRefreshTokenUsecase {
  constructor(
    @inject("ITokenService")
    private _tokenService: ITokenService
  ) {}

  async execute(
    refreshToken: string
  ): Promise<{ role: string; accessToken: string }> {
    if (!refreshToken) {
      throw new CustomError(
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_MESSAGE.TOKEN_MISSING
      );
    }

    const payload = this._tokenService.verifyRefreshToken(refreshToken);

    if (!payload) {
      throw new CustomError(
        HTTP_STATUS.UNAUTHORIZED,
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
