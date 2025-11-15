import { inject, injectable } from "tsyringe";

import { PaginatedPackages } from "../../../../domain/entities/paginated-packages.entity";
import { CustomError } from "../../../../domain/errors/customError";
import { ValidationError } from "../../../../domain/errors/validationError";
import { IAdminRepository } from "../../../../domain/repositoryInterfaces/admin/admin-repository.interface";
import { IPackageRepository } from "../../../../domain/repositoryInterfaces/package/package-repository.interface";
import { IVendorRepository } from "../../../../domain/repositoryInterfaces/vendor/vendor-repository.interface";
import {
  ERROR_MESSAGE,
  HTTP_STATUS,
  TRole,
} from "../../../../shared/constants";
import { PackageMapper } from "../../../mapper/package.mapper";
import { IGetPackagesUsecase } from "../../interfaces/package/getPackages-usecase.interface";

@injectable()
export class GetPackageUsecase implements IGetPackagesUsecase {
  constructor(
    @inject("IPackageRepository")
    private _packageRepository: IPackageRepository,

    @inject("IVendorRepository")
    private _vendorRepository: IVendorRepository,

    @inject("IAdminRepository")
    private _adminRepository: IAdminRepository
  ) {}

  async execute(
    userId: string,
    searchTerm: string,
    status: string,
    category: string,
    pageNumber: number,
    pageSize: number,
    userType: TRole
  ): Promise<PaginatedPackages> {
    if (!userId) {
      throw new ValidationError(ERROR_MESSAGE.ID_REQUIRED);
    }

    if (userType === "vendor") {
      const agencyExist = await this._vendorRepository.findById(userId);
      if (!agencyExist) {
        throw new CustomError(
          HTTP_STATUS.BAD_REQUEST,
          ERROR_MESSAGE.USER_NOT_FOUND
        );
      }
    }

    if (userType === "admin") {
      const adminExist = await this._adminRepository.findById(userId);
      if (!adminExist) {
        throw new CustomError(
          HTTP_STATUS.BAD_REQUEST,
          ERROR_MESSAGE.USER_NOT_FOUND
        );
      }
    }

    const validPageNumber = Math.max(1, pageNumber || 0);
    const validPageSize = Math.max(1, pageSize || 10);

    const { packages, total } = await this._packageRepository.find({
      userId,
      userType,
      searchTerm,
      status,
      category,
      pageNumber: validPageNumber,
      pageSize: validPageSize,
    });

    const packageDetails = packages.map((doc) =>
      PackageMapper.mapToPackageToVendorTableDto(doc)
    );

    const response: PaginatedPackages = {
      packages: packageDetails,
      total: Math.ceil(total / validPageSize),
    };

    return response;
  }
}
