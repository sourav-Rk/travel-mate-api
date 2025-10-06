import { inject, injectable } from "tsyringe";

import { IUserEntity } from "../../../../../domain/entities/user.entity";
import { IClientRepository } from "../../../../../domain/repositoryInterfaces/client/client.repository.interface";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../../../../shared/constants";
import { LoginUserDTO } from "../../../../dto/response/user.dto";
import { CustomError } from "../../../../../domain/errors/customError";

import { ILoginStrategy } from "../../../../../useCases/auth/login-strategies/login-strategy.interface";

@injectable()
export class ClientGoogleLoginStrategy implements ILoginStrategy {
  constructor(
    @inject("IClientRepository")
    private _clientRepository: IClientRepository
  ) {}

  async login(user: LoginUserDTO): Promise<Partial<IUserEntity>> {
    const client = await this._clientRepository.findByEmail(user.email);

    if (client) {
      if (client.isBlocked) {
        throw new CustomError(
          HTTP_STATUS.FORBIDDEN,
          ERROR_MESSAGE.BLOCKED_ERROR
        );
      }
    }
    return client as Partial<IUserEntity>;
  }
}
