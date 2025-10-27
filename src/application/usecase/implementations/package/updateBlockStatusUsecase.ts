import { inject, injectable } from "tsyringe";

import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ValidationError } from "../../../../domain/errors/validationError";
import { IPackageRepository } from "../../../../domain/repositoryInterfaces/package/package-repository.interface";
import { ERROR_MESSAGE } from "../../../../shared/constants";
import { IUpdateBlockStatusUsecase } from "../../interfaces/package/update-block-status-usecase.interface";

@injectable()
export class UpdateBlockStatusUsecase implements IUpdateBlockStatusUsecase {
  constructor(
    @inject("IPackageRepository")
    private _packageRepository: IPackageRepository
  ) {}

  async execute(packageId: string): Promise<void> {
    if (!packageId) {
      throw new ValidationError(ERROR_MESSAGE.PACKAGE_ID_IS_REQUIRED);
    }

    const existingPackage = await this._packageRepository.findById(packageId);

    if (!existingPackage) {
      throw new NotFoundError(ERROR_MESSAGE.PACKAGE_NOT_FOUND);
    }

    if (existingPackage.paymentAlertSentAt) {
      throw new ValidationError(ERROR_MESSAGE.PACKAGE_CANNOT_BE_BLOCKED);
    }

    await this._packageRepository.updateBlock(
      packageId,
      existingPackage.isBlocked!
    );
  }
}
