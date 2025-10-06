import { inject, injectable } from "tsyringe";

import { IPackageEntity } from "../../../../../domain/entities/package.entity";
import { IPackageRepository } from "../../../../../domain/repositoryInterfaces/package/package-repository.interface";
import { IGetTrendingPackagesUsecase } from "../../../interfaces/package/client-package/get-trending-packages.usecase";

@injectable()
export class GetTrendingPackages implements IGetTrendingPackagesUsecase {
  constructor(
    @inject("IPackageRepository")
    private _packageRepository: IPackageRepository
  ) {}

  async execute(): Promise<IPackageEntity[]> {
    const response = await this._packageRepository.getTrendingPackages();
    return response;
  }
}
