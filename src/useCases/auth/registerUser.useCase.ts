import { inject, injectable } from "tsyringe";
import { IRegisterUserUsecase } from "../../entities/useCaseInterfaces/auth/registerUsecase.interface";
import {
  ISuccessResponseHandler,
  successResponseHandler,
} from "../../shared/utils/successResponseHandler";
import { CustomError } from "../../shared/utils/error/customError";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../shared/constants";
import { IRegisterStrategy } from "./register-strategies/register-strategy.interface";
import { UserDto } from "../../shared/dto/user.dto";

@injectable()
export class RegisterUserUsecase implements IRegisterUserUsecase {
  private strategies: Record<string, IRegisterStrategy>;
  constructor(
    @inject("ClientRegisterStrategy")
    private clientRegister: IRegisterStrategy,

    @inject("VendorRegisteryStrategy")
    private vendorRegister : IRegisterStrategy
  ) {
    this.strategies = {
      client: this.clientRegister,
      vendor : this.vendorRegister,
    };
  }

  async execute(user: UserDto): Promise<ISuccessResponseHandler> {
    const strategy = this.strategies[user.role];
    if (!strategy) {
      throw new CustomError(
        HTTP_STATUS.FORBIDDEN,
        ERROR_MESSAGE.INVALID_USER_ROLE
      );
    }

    await strategy.register(user);
    
    return  successResponseHandler(
      true,
      HTTP_STATUS.CREATED,
      `Account created succesfully`
    );
  }
}
