import { inject, injectable } from "tsyringe";

import { IUserEntity } from "../../../entities/modelsEntity/user.entity";
import { IClientRepository } from "../../../entities/repositoryInterfaces/client/client.repository.interface";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../../shared/constants";
import { ClientDto, UserDto } from "../../../shared/dto/user.dto";
import { hashPassword } from "../../../shared/utils/bcryptHelper";
import { CustomError } from "../../../shared/utils/error/customError";

import { IRegisterStrategy } from "./register-strategy.interface";

@injectable()
export class ClientRegisterStrategy implements IRegisterStrategy {
  constructor(
    @inject("IClientRepository")
    private _ClientRepository: IClientRepository
  ) {}

  async register(user: UserDto): Promise<IUserEntity | void> {
    if (user.role === "client") {
      const existingUser = await this._ClientRepository.findByEmail(user.email);
      if (existingUser) {
        throw new CustomError(HTTP_STATUS.CONFLICT, ERROR_MESSAGE.EMAIL_EXISTS);
      }

      if (user.phone) {
        const existingPhone = await this._ClientRepository.findByNumber(
          user?.phone
        );

        if (existingPhone) {
          throw new CustomError(
            HTTP_STATUS.CONFLICT,
            ERROR_MESSAGE.PHONE_NUMBER_EXISTS
          );
        }
      }

      const { firstName, lastName, email, password, phone, gender,googleId } =
        user as ClientDto;

      const hashedPassword = password ? await hashPassword(password) : "";

      const client = await this._ClientRepository.save({
        firstName,
        lastName,
        email,
        phone,
        password: hashedPassword,
        gender,
        role: "client",
        googleId
      });

      return client;
    } else {
      throw new CustomError(
        HTTP_STATUS.BAD_REQUEST,
        "Invalid role for client registration"
      );
    }
  }
}
