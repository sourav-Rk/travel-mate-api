import { inject, injectable } from "tsyringe";
import { ILogoutUsecase } from "../../entities/useCaseInterfaces/auth/logout-usecase.interface";
import { ITokenRepository } from "../../entities/repositoryInterfaces/token/token-repository.interface";
import { ITokenService } from "../../entities/serviceInterfaces/token-service.interface";
import { CustomJwtPayload } from "../../interfaceAdapters/middlewares/auth.middleware";

@injectable()
export class LogoutUsecase implements ILogoutUsecase {
  constructor(
    @inject("ITokenRepository")
    private _tokenRepository: ITokenRepository,

    @inject("ITokenService")
    private _tokenService: ITokenService
  ) {}

  async execute(refreshToken: string, accessToken: string): Promise<void> {
    const payload = this._tokenService.verifyAccessToken(
      accessToken
    ) as CustomJwtPayload;

    await this._tokenRepository.deleteByTokenAndUserId(
      refreshToken,
      payload.id
    );
  }
}
