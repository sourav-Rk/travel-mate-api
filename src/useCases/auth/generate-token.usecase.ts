import { inject, injectable } from "tsyringe";

import { ITokenService } from "../../entities/serviceInterfaces/token-service.interface";
import { IGenerateTokenUseCase } from "../../entities/useCaseInterfaces/auth/generate-token-usecase.interface";

@injectable()
export class GenerateTokenUseCase implements IGenerateTokenUseCase {
  constructor(
    @inject("ITokenService")
    private tokenService: ITokenService
  ) {}

  async execute(
    id: string,
    email: string,
    role: string,
    status?: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload  = {
      id,
      email,
      role,
      ...(status && { status }),
    };

    const accessToken = this.tokenService.generateAccessToken(payload);
    const refreshToken = this.tokenService.generateRefreshToken(payload);

    return {
      accessToken,
      refreshToken,
    };
  }
}
