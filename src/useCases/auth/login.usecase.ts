import { inject, injectable } from "tsyringe";
import { ILoginUsecase } from "../../entities/useCaseInterfaces/auth/loginUsecase.interface";
import { HTTP_STATUS, ROLES, TRole } from "../../shared/constants";
import { CustomError } from "../../shared/utils/error/customError";
import { IUserEntity } from "../../entities/modelsEntity/user.entity";
import { ILoginStrategy } from "./login-strategies/login-strategy.interface";
import { LoginUserDTO } from "../../shared/dto/user.dto";

@injectable()
export class LoginUsecase implements ILoginUsecase {
  private _strategies : Record<string,ILoginStrategy>
  constructor(
    @inject('ClientLoginStrategy')
    private clientLoginStrategy : ILoginStrategy,

    @inject('AdminLoginStrategy')
    private adminLoginStrategy : ILoginStrategy,
    
    @inject('VendorLoginStrategy')
    private vendorLoginStrategy : ILoginStrategy,

    @inject('GuideLoginStrategy')
    private guideLoginStrategy : ILoginStrategy
    
  ) {
    this._strategies = {
       client : this.clientLoginStrategy,
       admin : this.adminLoginStrategy,
       vendor : this.vendorLoginStrategy,
       guide : this.guideLoginStrategy
    }
  }

  async execute(user : LoginUserDTO): Promise<Partial<IUserEntity>> {
       const strategy = this._strategies[user.role];
       if(!strategy){
        throw new CustomError(HTTP_STATUS.FORBIDDEN,"invalid user role")
       };

       return await strategy.login(user)
  }
}

