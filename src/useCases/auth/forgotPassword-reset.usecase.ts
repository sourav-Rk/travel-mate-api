import { inject, injectable } from "tsyringe";
import { IForgotPasswordResetUsecase } from "../../entities/useCaseInterfaces/auth/forgotPassword-reset-usecase.interface";
import { CustomError } from "../../shared/utils/error/customError";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../shared/constants";
import { AuthError } from "../../shared/utils/error/authError";
import { ValidationError } from "../../shared/utils/error/validationError";
import { JwtPayload } from "jsonwebtoken";
import { ITokenService } from "../../entities/serviceInterfaces/token-service.interface";
import { IUserExistenceService } from "../../entities/serviceInterfaces/user-existence-service.interface";
import { NotFoundError } from "../../shared/utils/error/notFoundError";
import { IClientRepository } from "../../entities/repositoryInterfaces/client/client.repository.interface";
import { IVendorRepository } from "../../entities/repositoryInterfaces/vendor/vendor-repository.interface";
import { IGuideRepository } from "../../entities/repositoryInterfaces/guide/guide-repository.interface";
import { hashPassword } from "../../shared/utils/bcryptHelper";
import { IRedisTokenRepository } from "../../entities/repositoryInterfaces/redis/redis-token-repository.interface";

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

    @inject('IRedisTokenRepository')
    private _redisTokenRepository : IRedisTokenRepository,

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
      throw new ValidationError("Password and confirm password is required");
    }

    if (password !== confirmPassword) {
      throw new CustomError(
        HTTP_STATUS.BAD_REQUEST,
        "Password and confirm password must be same"
      );
    }

    const payload: JwtPayload | null =
      this._tokenService.verifyResetToken(token);
    if (!payload)
      throw new CustomError(
        HTTP_STATUS.BAD_REQUEST,
        "invalid or expired token"
      );

    const { email, role, id } = payload;
    const blackListToken = await this._redisTokenRepository.isTokenBlackListed(token);
    if (blackListToken) {
      throw new CustomError(HTTP_STATUS.FORBIDDEN, "Token is black listed");
    }
   
    //token expiry calculation
    const tokenExpiry = payload.exp as number;
    const currentTime = Math.floor(Date.now() /1000);
    const remainingTime = tokenExpiry - currentTime;

    const user = this._userExistenceService.emailExists(email);

    if (!user) throw new NotFoundError("user not found");

    const hashedPassword = await hashPassword(password);

    const repository = this._repository[role];

    if (!repository) {
      throw new CustomError(HTTP_STATUS.FORBIDDEN, "Invalid user role");
    }

    await Promise.all([
      repository.findByIdAndUpdatePassword(id,hashedPassword),
      this._redisTokenRepository.blackListToken(token,remainingTime)
    ])
  }
}
