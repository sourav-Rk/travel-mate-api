import { inject, injectable } from "tsyringe";

import { IPackageEntity } from "../../../entities/modelsEntity/package.entity";
import { IPackageRepository } from "../../../entities/repositoryInterfaces/package/package-repository.interface";
import {  IGetTrendingPackagesUsecase } from "../../../entities/useCaseInterfaces/package/client-package/get-trending-packages.usecase";

@injectable()
export class GetTrendingPackages implements IGetTrendingPackagesUsecase {
    constructor(
        @inject('IPackageRepository')
        private _packageRepository : IPackageRepository
    ){}

    async execute(): Promise<IPackageEntity[]> {
        const response = await this._packageRepository.getTrendingPackages();
        return response;
    }
}