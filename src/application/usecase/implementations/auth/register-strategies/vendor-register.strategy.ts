import { inject, injectable } from "tsyringe";

import { IUserEntity } from "../../../../../domain/entities/user.entity";
import { IVendorRepository } from "../../../../../domain/repositoryInterfaces/vendor/vendor-repository.interface";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../../../../shared/constants";
import { UserDto, VendorDto } from "../../../../dto/response/user.dto"
import { hashPassword } from "../../../../../shared/utils/bcryptHelper";
import { CustomError } from "../../../../../domain/errors/customError";

import { IRegisterStrategy } from "./register-strategy.interface";

@injectable()
export class VendorRegisteryStrategy implements IRegisterStrategy {
  constructor(
    @inject("IVendorRepository")
    private VendorRepository: IVendorRepository
  ) {}

  async register(user: UserDto): Promise<IUserEntity | void> {
    if (user.role === "vendor") {
      const existingUser = await this.VendorRepository.findByEmail(user.email);

      if (existingUser) {
        throw new CustomError(HTTP_STATUS.CONFLICT, ERROR_MESSAGE.EMAIL_EXISTS);
      }

      const existingPhone = await this.VendorRepository.findByNumber(
        user.phone
      );
      if (existingPhone) {
        throw new CustomError(
          HTTP_STATUS.CONFLICT,
          ERROR_MESSAGE.PHONE_NUMBER_EXISTS
        );
      }

      const {
        firstName,
        lastName,
        email,
        phone,
        role,
        password,
        agencyName,
        description,
      } = user as VendorDto;

      const hashedPassword = password ? await hashPassword(password) : "";

      const vendor = await this.VendorRepository.save({
        firstName,
        lastName,
        email,
        phone,
        password: hashedPassword,
        role,
        agencyName,
        description,
      });
      return vendor;
    } else {
      throw new CustomError(
        HTTP_STATUS.BAD_REQUEST,
        "invalid role for vendor registration"
      );
    }
  }
}
