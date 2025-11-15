import { inject, injectable } from "tsyringe";

import { IPackageRepository } from "../../../../../domain/repositoryInterfaces/package/package-repository.interface";
import { PaginatedPackagesUserSideListing } from "../../../../dto/response/packageDto";
import { PackageMapper } from "../../../../mapper/package.mapper";
import { IGetAvailablePackagesUsecase } from "../../../interfaces/package/client-package/getAvailable-package-usecase.interface";

@injectable()
export class GetAvailbalePackagesUsecase
  implements IGetAvailablePackagesUsecase
{
  constructor(
    @inject("IPackageRepository")
    private _packagesRepository: IPackageRepository
  ) {}

  async execute(
    search: string,
    categories: string[],
    priceRange: number[],
    duration: string,
    pageNumber: number,
    pageSize: number,
    sortBy: string
  ): Promise<PaginatedPackagesUserSideListing> {
    //pagination
    const validPageNumber = Math.max(1, pageNumber || 0);
    const validPageSize = Math.max(1, pageSize || 10);

    const { packages, total } =
      await this._packagesRepository.getActivePackages(
        search,
        categories,
        priceRange,
        duration,
        validPageNumber,
        validPageSize,
        sortBy
      );

    const packageDetails = packages.map((doc) =>
      PackageMapper.mapPackageToUserListingDto(doc)
    );

    const response = {
      packages: packageDetails,
      total: Math.ceil(total / validPageSize),
    };
    return response;
  }
}
