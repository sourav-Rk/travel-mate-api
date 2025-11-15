import { inject, injectable } from "tsyringe";

import { CustomError } from "../../../../domain/errors/customError";
import { IClientRepository } from "../../../../domain/repositoryInterfaces/client/client.repository.interface";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../../../shared/constants";
import {
  comparePassword,
  hashPassword,
} from "../../../../shared/utils/bcryptHelper";
import { IUpdateClientPasswordUsecase } from "../../interfaces/client/update-client-password-usecase.interface";

@injectable()
export class UpdateClientPasswordUsecase
  implements IUpdateClientPasswordUsecase
{
  constructor(
    @inject("IClientRepository")
    private _clientRepository: IClientRepository
  ) {}

  async execute(
    id: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await this._clientRepository.findById(id);

    if (!user) {
      throw new CustomError(HTTP_STATUS.NOT_FOUND, ERROR_MESSAGE.USER_NOT_FOUND);
    }

    const isPasswordMatch = await comparePassword(
      currentPassword,
      user.password
    );

    if (!isPasswordMatch) {
      throw new CustomError(
        HTTP_STATUS.BAD_REQUEST,
        ERROR_MESSAGE.CURRENT_PASSWORD_WRONG
      );
    }

    const isCurrAndNewPassSame = await comparePassword(
      newPassword,
      user.password
    );

    if (isCurrAndNewPassSame) {
      throw new CustomError(
        HTTP_STATUS.BAD_REQUEST,
        ERROR_MESSAGE.CURRENT_AND_NEW_SAME
      );
    }

    const hashedPassword = await hashPassword(newPassword);

    await this._clientRepository.findByIdAndUpdatePassword(id, hashedPassword);
  }
}
