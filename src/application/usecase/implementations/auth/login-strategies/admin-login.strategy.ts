import { inject, injectable } from "tsyringe";

import { IUserEntity } from "../../../../../domain/entities/user.entity";
import { IAdminRepository } from "../../../../../domain/repositoryInterfaces/admin/admin-repository.interface";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../../../../shared/constants";
import { LoginUserDTO } from "../../../../dto/response/user.dto";
import { comparePassword } from "../../../../../shared/utils/bcryptHelper";
import { CustomError } from "../../../../../domain/errors/customError";
import { NotFoundError } from "../../../../../domain/errors/notFoundError";

import { ILoginStrategy } from "./login-strategy.interface";

@injectable()
export class AdminLoginStrategy implements ILoginStrategy {
  constructor(
    @inject("IAdminRepository")
    private adminRepository: IAdminRepository
  ) {}

  async login(user: LoginUserDTO): Promise<Partial<IUserEntity>> {
    const admin = await this.adminRepository.findByEmail(user.email);

    if (!admin) {
      throw new NotFoundError(ERROR_MESSAGE.EMAIL_NOT_FOUND);
    }

    if (user.password) {
      const isPasswordMatch = comparePassword(user.password, admin.password);

      if (!isPasswordMatch) {
        throw new CustomError(
          HTTP_STATUS.BAD_REQUEST,
          ERROR_MESSAGE.INVALID_CREDENTIALS
        );
      }
    }

    return admin;
  }
}
