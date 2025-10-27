import { JwtPayload } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import { AuthError } from "../../../../domain/errors/authError";
import { CustomError } from "../../../../domain/errors/customError";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ValidationError } from "../../../../domain/errors/validationError";
import { IClientRepository } from "../../../../domain/repositoryInterfaces/client/client.repository.interface";
import { IGuideRepository } from "../../../../domain/repositoryInterfaces/guide/guide-repository.interface";
import { IRedisTokenRepository } from "../../../../domain/repositoryInterfaces/redis/redis-token-repository.interface";
import { IVendorRepository } from "../../../../domain/repositoryInterfaces/vendor/vendor-repository.interface";
import { ITokenService } from "../../../../domain/service-interfaces/token-service.interface";
import { IUserExistenceService } from "../../../../domain/service-interfaces/user-existence-service.interface";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../../../shared/constants";
import { hashPassword } from "../../../../shared/utils/bcryptHelper";
import { IForgotPasswordResetUsecase } from "../../interfaces/auth/forgotPassword-reset-usecase.interface";

@injectable()
export class ForgotPasswordResetUsecase implements IForgotPasswordResetUsecase {
  private _repository: Record<
    string,
    IClientRepository | IVendorRepository | IGuideRepository
  >;
  constructor(
    @inject("ITokenService")
    private _tokenService: ITokenService,

    @inject("IUserExistenceService")
    private _userExistenceService: IUserExistenceService,

    @inject("IRedisTokenRepository")
    private _redisTokenRepository: IRedisTokenRepository,

    @inject("IClientRepository")
    private _clientRepository: IClientRepository,

    @inject("IVendorRepository")
    private _vendorRepository: IVendorRepository,

    @inject("IGuideRepository")
    private _guideRepository: IGuideRepository
  ) {
    this._repository = {
      client: this._clientRepository,
      vendor: this._vendorRepository,
      guide: this._guideRepository,
    };
  }

  async execute(
    token: string,
    password: string,
    confirmPassword: string
  ): Promise<void> {
    if (!token) {
      throw new AuthError(
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_MESSAGE.UNAUTHORIZED_ACCESS
      );
    }

    if (!password || !confirmPassword) {
      throw new ValidationError(ERROR_MESSAGE.PASSWORD_AND_CONFIRM_PASSWORD_REQUIRED);
    }

    if (password !== confirmPassword) {
      throw new CustomError(
        HTTP_STATUS.BAD_REQUEST,
        ERROR_MESSAGE.PASSWORD_AND_CONFIRM_PASSWORD_MUST_BE_SAME
      );
    }

    const payload: JwtPayload | null =
      this._tokenService.verifyResetToken(token);
    if (!payload)
      throw new CustomError(
        HTTP_STATUS.BAD_REQUEST,
        ERROR_MESSAGE.INVALID_OR_EXPIRED_TOKEN
      );

    const { email, role, id } = payload;
    const blackListToken = await this._redisTokenRepository.isTokenBlackListed(
      token
    );
    if (blackListToken) {
      throw new CustomError(HTTP_STATUS.FORBIDDEN, ERROR_MESSAGE.TOKEN_BLACK_LISTED);
    }

    //token expiry calculation
    const tokenExpiry = payload.exp as number;
    const currentTime = Math.floor(Date.now() / 1000);
    const remainingTime = tokenExpiry - currentTime;

    const user = this._userExistenceService.emailExists(email);

    if (!user) throw new NotFoundError(ERROR_MESSAGE.USER_NOT_FOUND);

    const hashedPassword = await hashPassword(password);

    const repository = this._repository[role];

    if (!repository) {
      throw new CustomError(HTTP_STATUS.FORBIDDEN, ERROR_MESSAGE.INVALID_USER_ROLE);
    }

    await Promise.all([
      repository.findByIdAndUpdatePassword(id, hashedPassword),
      this._redisTokenRepository.blackListToken(token, remainingTime),
    ]);
  }
}
