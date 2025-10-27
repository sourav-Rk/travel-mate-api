import { inject, injectable } from "tsyringe";

import { IUserEntity } from "../../../../domain/entities/user.entity";
import { CustomError } from "../../../../domain/errors/customError";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../../../shared/constants";
import { LoginUserDTO } from "../../../dto/response/user.dto";
import { ILoginUsecase } from "../../interfaces/auth/loginUsecase.interface";

import { ILoginStrategy } from "./login-strategies/login-strategy.interface";

@injectable()
export class LoginUsecase implements ILoginUsecase {
  private _strategies: Record<string, ILoginStrategy>;
  constructor(
    @inject("ClientLoginStrategy")
    private clientLoginStrategy: ILoginStrategy,

    @inject("AdminLoginStrategy")
    private adminLoginStrategy: ILoginStrategy,

    @inject("VendorLoginStrategy")
    private vendorLoginStrategy: ILoginStrategy,

    @inject("GuideLoginStrategy")
    private guideLoginStrategy: ILoginStrategy
  ) {
    this._strategies = {
      client: this.clientLoginStrategy,
      admin: this.adminLoginStrategy,
      vendor: this.vendorLoginStrategy,
      guide: this.guideLoginStrategy,
    };
  }

  async execute(user: LoginUserDTO): Promise<Partial<IUserEntity>> {
    const strategy = this._strategies[user.role];
    if (!strategy) {
      throw new CustomError(HTTP_STATUS.FORBIDDEN,ERROR_MESSAGE.INVALID_ROLE);
    }

    return await strategy.login(user);
  }
}
