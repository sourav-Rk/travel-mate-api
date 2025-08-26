import { inject, injectable } from "tsyringe";

import { IAdminRepository } from "../../entities/repositoryInterfaces/admin/admin-repository.interface";
import { IPackageRepository } from "../../entities/repositoryInterfaces/package/package-repository.interface";
import { IVendorRepository } from "../../entities/repositoryInterfaces/vendor/vendor-repository.interface";
import { IGetPackageDetailsUsecase } from "../../entities/useCaseInterfaces/package/getPackageDetails-usecase.interface";
import { ERROR_MESSAGE } from "../../shared/constants";
import { IPackage } from "../../shared/dto/packageDto";
import { NotFoundError } from "../../shared/utils/error/notFoundError";
import { ValidationError } from "../../shared/utils/error/validationError";

@injectable()
export class GetPackageDetailsUsecase implements IGetPackageDetailsUsecase {
  constructor(
    @inject("IPackageRepository")
    private _packageRepository: IPackageRepository,

    @inject("IVendorRepository")
    private _vendorRepository: IVendorRepository,

    @inject("IAdminRepository")
    private _adminRepository: IAdminRepository
  ) {}

  async execute(
    userType: string,
    userId: string,
    packageId: string
  ): Promise<IPackage> {
    if (!userId || !packageId) {
      throw new ValidationError(
        ERROR_MESSAGE.AGENCY_ID_AND_PACKAGE_ID_IS_REQUIRED
      );
    }

    if (userType === "vendor") {
      const agency = await this._vendorRepository.findById(userId);

      if (!agency) {
        throw new NotFoundError(ERROR_MESSAGE.AGENCY_NOT_FOUND);
      }
    }

    if (userType === "admin") {
      const admin = await this._adminRepository.findById(userId);

      if (!admin) {
        throw new NotFoundError(ERROR_MESSAGE.AGENCY_NOT_FOUND);
      }
    }

    const response = await this._packageRepository.getPackageDetails(packageId);
    return response;
  }
}
