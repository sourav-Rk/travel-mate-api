import { inject, injectable } from "tsyringe";

import { IClientRepository } from "../../../../domain/repositoryInterfaces/client/client.repository.interface";
import { IUpdateClientPasswordUsecase } from "../../interfaces/client/update-client-password-usecase.interface";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../../../shared/constants";
import {
  comparePassword,
  hashPassword,
} from "../../../../shared/utils/bcryptHelper";
import { CustomError } from "../../../../domain/errors/customError";

@injectable()
export class UpdateClientPasswordUsecase
  implements IUpdateClientPasswordUsecase
{
  constructor(
    @inject("IClientRepository")
    private _clientRepository: IClientRepository
  ) {}

  async execute(
    id: any,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await this._clientRepository.findById(id);

    if (!user) {
      throw new CustomError(HTTP_STATUS.NOT_FOUND, "User not found");
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
