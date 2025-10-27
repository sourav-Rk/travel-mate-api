import { inject, injectable } from "tsyringe";

import { CustomError } from "../../../../domain/errors/customError";
import { IVendorRepository } from "../../../../domain/repositoryInterfaces/vendor/vendor-repository.interface";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../../../shared/constants";
import {
  comparePassword,
  hashPassword,
} from "../../../../shared/utils/bcryptHelper";
import { IUpdateVendorPasswordUsecase } from "../../interfaces/vendor/update-vendor-password-usecase.interface";

@injectable()
export class UpdateVendorPasswordUsecase
  implements IUpdateVendorPasswordUsecase
{
  constructor(
    @inject("IVendorRepository")
    private _vendorRepository: IVendorRepository
  ) {}

  async execute(
    id: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await this._vendorRepository.findById(id);

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

    await this._vendorRepository.findByIdAndUpdatePassword(id, hashedPassword);
  }
}
