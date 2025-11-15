import { inject, injectable } from "tsyringe";

import { IUserEntity } from "../../../../../domain/entities/user.entity";
import { CustomError } from "../../../../../domain/errors/customError";
import { NotFoundError } from "../../../../../domain/errors/notFoundError";
import { IClientRepository } from "../../../../../domain/repositoryInterfaces/client/client.repository.interface";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../../../../shared/constants";
import { comparePassword } from "../../../../../shared/utils/bcryptHelper";
import { LoginUserDTO } from "../../../../dto/response/user.dto";

import { ILoginStrategy } from "./login-strategy.interface";

@injectable()
export class ClientLoginStrategy implements ILoginStrategy {
  constructor(
    @inject("IClientRepository")
    private clientRepository: IClientRepository
  ) {}

  async login(user: LoginUserDTO): Promise<Partial<IUserEntity>> {
    const client = await this.clientRepository.findByEmail(user.email);

    if (!client) {
      throw new NotFoundError(ERROR_MESSAGE.EMAIL_NOT_FOUND);
    }

    if (client.isBlocked) {
      throw new CustomError(HTTP_STATUS.FORBIDDEN, ERROR_MESSAGE.BLOCKED_ERROR);
    }

    if (user.password) {
      const isPasswordMatch = await comparePassword(
        user.password,
        client.password
      );

      if (!isPasswordMatch) {
        throw new CustomError(
          HTTP_STATUS.BAD_REQUEST,
          ERROR_MESSAGE.INVALID_CREDENTIALS
        );
      }
    }
    return client;
  }
}
