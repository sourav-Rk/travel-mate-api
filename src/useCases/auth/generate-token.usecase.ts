import { inject, injectable } from "tsyringe";

import { ITokenService } from "../../entities/serviceInterfaces/token-service.interface";
import { IGenerateTokenUseCase } from "../../entities/useCaseInterfaces/auth/generate-token-usecase.interface";


@injectable()
export class GenerateTokenUseCase implements IGenerateTokenUseCase {
  constructor(
    @inject("ITokenService")
    private _tokenService: ITokenService,

  ) {}

  async execute(
    id: string,
    email: string,
    role: string,
    status?: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = {
      id,
      email,
      role,
      ...(status && { status }),
    };

    const accessToken = this._tokenService.generateAccessToken(payload);
    const refreshToken = this._tokenService.generateRefreshToken(payload);

    // const refreshPayload = this._tokenService.verifyRefreshToken(refreshToken);

    // const expiry = new Date((refreshPayload?.exp ?? 0) * 1000);

    // await this._tokenRepository.save(id, refreshToken, expiry);

    return {
      accessToken,
      refreshToken,
    };
  }
}
