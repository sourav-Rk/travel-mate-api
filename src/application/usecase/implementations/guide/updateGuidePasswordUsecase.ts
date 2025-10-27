import { inject, injectable } from "tsyringe";

import { CustomError } from "../../../../domain/errors/customError";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ValidationError } from "../../../../domain/errors/validationError";
import { IGuideRepository } from "../../../../domain/repositoryInterfaces/guide/guide-repository.interface";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../../../shared/constants";
import {
  comparePassword,
  hashPassword,
} from "../../../../shared/utils/bcryptHelper";
import { IUpdateGuidePasswordUsecase } from "../../interfaces/guide/updateGuidePassword-usecase.interface";

@injectable()
export class UpdateGuidePasswordUsecase implements IUpdateGuidePasswordUsecase {
  constructor(
    @inject("IGuideRepository")
    private _guideRepository: IGuideRepository
  ) {}

  async execute(
    id: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    if (!id || !currentPassword || !newPassword) {
      throw new ValidationError(ERROR_MESSAGE.REQUIRED_FIELDS_MISSING);
    }

    const guide = await this._guideRepository.findById(id);

    if (!guide) {
      throw new NotFoundError(ERROR_MESSAGE.GUIDE_NOT_FOUND);
    }

    const isPasswordMatch = await comparePassword(
      currentPassword,
      guide.password
    );

    if (!isPasswordMatch) {
      throw new CustomError(
        HTTP_STATUS.BAD_REQUEST,
        ERROR_MESSAGE.CURRENT_PASSWORD_WRONG
      );
    }

    const isCurrAndNewPassSame = await comparePassword(
      newPassword,
      guide.password
    );

    if (isCurrAndNewPassSame) {
      throw new CustomError(
        HTTP_STATUS.BAD_REQUEST,
        ERROR_MESSAGE.CURRENT_AND_NEW_SAME
      );
    }

    const hashedPassword = await hashPassword(newPassword);

    await this._guideRepository.findByIdAndUpdatePassword(id, hashedPassword);
  }
}
