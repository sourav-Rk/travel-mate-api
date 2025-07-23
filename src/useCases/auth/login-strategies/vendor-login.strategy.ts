import { inject, injectable } from "tsyringe";
import { ILoginStrategy } from "./login-strategy.interface";
import { IVendorRepository } from "../../../entities/repositoryInterfaces/vendor/vendor-repository.interface";
import { IUserEntity } from "../../../entities/modelsEntity/user.entity";
import { LoginUserDTO } from "../../../shared/dto/user.dto";
import { NotFoundError } from "../../../shared/utils/error/notFoundError";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../../shared/constants";
import { CustomError } from "../../../shared/utils/error/customError";
import { comparePassword } from "../../../shared/utils/bcryptHelper";

@injectable()
export class VendorLoginStrategy implements ILoginStrategy {
  constructor(
    @inject("IVendorRepository")
    private vendorRepository: IVendorRepository
  ) {}

  async login(user: LoginUserDTO): Promise<Partial<IUserEntity>> {
    const vendor = await this.vendorRepository.findByEmail(user.email);

    if (!vendor) {
      throw new NotFoundError(ERROR_MESSAGE.EMAIL_NOT_FOUND);
    }

    if (vendor.isBlocked) {
      throw new CustomError(HTTP_STATUS.FORBIDDEN, ERROR_MESSAGE.BLOCKED_ERROR);
    }

    if(vendor.status === "rejected"){
      throw new CustomError(HTTP_STATUS.FORBIDDEN,ERROR_MESSAGE.REQUEST_REJECTED_BY_ADMIN)
    }

    if (user.password) {
      const isPasswordMatch = await comparePassword(
        user.password,
        vendor.password
      );

      if (!isPasswordMatch) {
        throw new CustomError(
          HTTP_STATUS.BAD_REQUEST,
          ERROR_MESSAGE.INVALID_CREDENTIALS
        );
      }
    }
    return vendor;
  }
}
