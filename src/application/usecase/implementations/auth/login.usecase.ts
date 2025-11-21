import { inject, injectable } from "tsyringe";

import { IUserEntity } from "../../../../domain/entities/user.entity";
import { CustomError } from "../../../../domain/errors/customError";
import { IWalletRepository } from "../../../../domain/repositoryInterfaces/wallet/wallet-repository.interface";
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
    private guideLoginStrategy: ILoginStrategy,

    @inject("IWalletRepository")
    private _walletRepository : IWalletRepository
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

    const loggedInUser = await strategy.login(user);

    if(user.role === "client" || user.role === "vendor" || user.role === "guide"){
       const userId = loggedInUser._id?.toString();

       if(userId){
        const existingWallet = await this._walletRepository.findByUserId(userId);

        if(!existingWallet){
          await this._walletRepository.save({
            userId,
            userType:user.role,
           balance : 0,
           currency : 'INR' 
          })
        }
       }
    }

    return loggedInUser;
  }
}
