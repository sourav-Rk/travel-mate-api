import { OAuth2Client } from "google-auth-library";
import { inject, injectable } from "tsyringe";

import { IUserEntity } from "../../../../domain/entities/user.entity";
import { CustomError } from "../../../../domain/errors/customError";
import { IUserExistenceService } from "../../../../domain/service-interfaces/user-existence-service.interface";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../../../shared/constants";
import { IGoogleUsecase } from "../../interfaces/auth/google-usecase.interface";

import { ILoginStrategy } from "./login-strategies/login-strategy.interface";
import { IRegisterStrategy } from "./register-strategies/register-strategy.interface";

@injectable()
export class GoogleUsecase implements IGoogleUsecase {
  private _registerStrategies: Record<string, IRegisterStrategy>;
  private _loginStrategies: Record<string, ILoginStrategy>;
  private _client: OAuth2Client;
  constructor(
    @inject("ClientRegisterStrategy")
    private _clientRegisterStrategy: IRegisterStrategy,

    @inject("ClientGoogleLoginStrategy")
    private _clientLogin: ILoginStrategy,

    @inject("IUserExistenceService")
    private _userExistenceService: IUserExistenceService
  ) {
    this._registerStrategies = {
      client: this._clientRegisterStrategy,
    };
    this._loginStrategies = {
      client: this._clientLogin,
    };
    this._client = new OAuth2Client();
  }

  async execute(
    credential: string,
    client_id: string,
    role: "client"
  ): Promise<Partial<IUserEntity>> {
    const registerStrategy = this._registerStrategies[role];
    const loginStrategy = this._loginStrategies[role];

    if (!registerStrategy || !loginStrategy) {
      throw new CustomError(HTTP_STATUS.FORBIDDEN, ERROR_MESSAGE.INVALID_USER_ROLE);
    }

    const ticket = await this._client.verifyIdToken({
      idToken: credential,
      audience: client_id,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      throw new CustomError(
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_MESSAGE.INVALID_OR_EMPTY_TOKEN_PAYLOAD
      );
    }

    const googleId = payload.sub;
    const email = payload.email;
    const firstName = payload.given_name;
    const lastName = payload.family_name;
    const profileImage = payload.picture;

    if (!email)
      throw new CustomError(HTTP_STATUS.BAD_REQUEST,ERROR_MESSAGE.EMAIL_REQUIRED);

    const existingUser = await loginStrategy.login({ email, role });

    if (!existingUser) {
      if (payload.email) {
        if (await this._userExistenceService.emailExists(payload?.email)) {
          throw new CustomError(
            HTTP_STATUS.CONFLICT,
            ERROR_MESSAGE.EMAIL_ALREADY_REGISTERED_GOOGLE
            );
        }
      }

      const newUser = await registerStrategy.register({
        firstName: firstName as string,
        lastName: lastName as string,
        role,
        googleId: googleId,
        email,
        profileImage,
      });
      console.log(newUser);

      if (!newUser) throw new CustomError(0, "");

      return { email, role, _id: newUser._id };
    }

    return { email, role, _id: existingUser._id };
  }
}
