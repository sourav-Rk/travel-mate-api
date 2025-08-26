import { IPackageEntity } from "../../../modelsEntity/package.entity";

export interface IGetTrendingPackagesUsecase {
    execute() : Promise<IPackageEntity[]>
}