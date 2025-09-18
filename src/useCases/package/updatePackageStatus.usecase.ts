import { inject, injectable } from "tsyringe";

import { IPackageRepository } from "../../entities/repositoryInterfaces/package/package-repository.interface";
import { IUpdatePackageStatusUsecase } from "../../entities/useCaseInterfaces/package/updatePackageStatus-usecase-interface";
import {
  ERROR_MESSAGE,
  HTTP_STATUS,
  PackageStatus,
} from "../../shared/constants";
import { CustomError } from "../../shared/utils/error/customError";
import { NotFoundError } from "../../shared/utils/error/notFoundError";
import { ValidationError } from "../../shared/utils/error/validationError";

@injectable()
export class UpdatePackageStatusUsecase implements IUpdatePackageStatusUsecase {
  constructor(
    @inject("IPackageRepository")
    private _packageRepository: IPackageRepository
  ) {}

  async execute(packageId: string, status: PackageStatus): Promise<void> {

    if (!packageId || !status) {
      throw new ValidationError(ERROR_MESSAGE.INSUFFICIENT_DATA);
    }

    const packageExist = await this._packageRepository.findById(packageId);

    if (!packageExist) {
      throw new NotFoundError(ERROR_MESSAGE.PACKAGE_NOT_FOUND);
    }

    const allowedTransformations = {
      active: ["draft"],
      draft: [""],
      ongoing: ["active"],
      completed: ["ongoing"],
      applications_closed : [""],
      cancelled : [""]
    };

    if (
      !packageExist.status ||
      !allowedTransformations[status].includes(packageExist.status)
    ) {
      throw new CustomError(
        HTTP_STATUS.CONFLICT,
        ERROR_MESSAGE.STATUS_CANNOT_BE_UPDATED
      );
    }

    await this._packageRepository.updatePackageStatus(packageId, status);
  }
}
