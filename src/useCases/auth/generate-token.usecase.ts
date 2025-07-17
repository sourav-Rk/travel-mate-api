import { inject, injectable } from "tsyringe";
import { IGenerateTokenUseCase } from "../../entities/useCaseInterfaces/auth/generate-token-usecase.interface";
import { ITokenService } from "../../entities/serviceInterfaces/token-service.interface";
import { JwtPayloadData } from "../../interfaceAdapters/services/token.service";

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
