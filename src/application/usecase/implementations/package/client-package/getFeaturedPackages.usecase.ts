import { inject, injectable } from "tsyringe";

import { IPackageEntity } from "../../../../../domain/entities/package.entity";
import { NotFoundError } from "../../../../../domain/errors/notFoundError";
import { ValidationError } from "../../../../../domain/errors/validationError";
import { IPackageRepository } from "../../../../../domain/repositoryInterfaces/package/package-repository.interface";
import { ERROR_MESSAGE } from "../../../../../shared/constants";
import { IGetFeaturedPackagesUsecase } from "../../../interfaces/package/client-package/getFeaturedPackages-usecase.interface";

@injectable()
export class GetFeaturedPackagesUsecase implements IGetFeaturedPackagesUsecase {
  constructor(
    @inject("IPackageRepository")
    private _packageRepository: IPackageRepository
  ) {}

  async execute(packageId: string): Promise<IPackageEntity[]> {
    if (!packageId) {
      throw new ValidationError(ERROR_MESSAGE.PACKAGE_ID_IS_REQUIRED);
    }

    const existingPackage = await this._packageRepository.findByPackageId(
      packageId
    );

    if (!existingPackage) {
      throw new NotFoundError(ERROR_MESSAGE.PACKAGE_NOT_FOUND);
    }

    const response = await this._packageRepository.getFeaturedPackages(
      existingPackage.category
    );
    return response;
  }
}
