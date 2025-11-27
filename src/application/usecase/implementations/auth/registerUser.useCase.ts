import { inject, injectable } from "tsyringe";

import { CustomError } from "../../../../domain/errors/customError";
import { IWalletRepository } from "../../../../domain/repositoryInterfaces/wallet/wallet-repository.interface";
import { ERROR_MESSAGE, HTTP_STATUS, SUCCESS_MESSAGE } from "../../../../shared/constants";
import {
  ISuccessResponseHandler,
  successResponseHandler,
} from "../../../../shared/utils/successResponseHandler";
import { UserDto } from "../../../dto/response/user.dto";
import { IRegisterUserUsecase } from "../../interfaces/auth/registerUsecase.interface";

import { IRegisterStrategy } from "./register-strategies/register-strategy.interface";

@injectable()
export class RegisterUserUsecase implements IRegisterUserUsecase {
  private strategies: Record<string, IRegisterStrategy>;
  constructor(
    @inject("ClientRegisterStrategy")
    private clientRegister: IRegisterStrategy,

    @inject("VendorRegisteryStrategy")
    private vendorRegister: IRegisterStrategy,

    @inject("IWalletRepository")
    private _walletRepository: IWalletRepository,
  ) {
    this.strategies = {
      client: this.clientRegister,
      vendor: this.vendorRegister,
    };
  }

  async execute(user: UserDto): Promise<ISuccessResponseHandler> {
    const strategy = this.strategies[user.role];
    if (!strategy) {
      throw new CustomError(HTTP_STATUS.FORBIDDEN, ERROR_MESSAGE.INVALID_USER_ROLE);
    }

    const createdUser = await strategy.register(user);

    if (!createdUser || !createdUser._id) {
      throw new CustomError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        ERROR_MESSAGE.USER_REGISTRATION_FAILED, 
      );
    }

    await this._walletRepository.save({
      userId: createdUser._id,
      userType: user.role,
      balance: 0,
      currency: "INR",
    });

    return successResponseHandler(true, HTTP_STATUS.CREATED, SUCCESS_MESSAGE.ACCOUNT_CREATED);
  }
}
