import { inject, injectable } from "tsyringe";

import { ITokenService } from "../../../../domain/service-interfaces/token-service.interface";
import { CustomJwtPayload } from "../../../../presentation/middlewares/auth.middleware";
import { ILogoutUsecase } from "../../interfaces/auth/logout-usecase.interface";

@injectable()
export class LogoutUsecase implements ILogoutUsecase {
  constructor(
    @inject("ITokenService")
    private _tokenService: ITokenService
  ) {}

  async execute(refreshToken: string, accessToken: string): Promise<void> {
    const payload = this._tokenService.verifyAccessToken(
      accessToken
    ) as CustomJwtPayload;
  }
}
