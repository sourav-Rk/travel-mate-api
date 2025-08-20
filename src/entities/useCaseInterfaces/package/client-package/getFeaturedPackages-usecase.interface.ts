import { IPackageEntity } from "../../../modelsEntity/package.entity";

export interface IGetFeaturedPackagesUsecase {
    execute(packageId : any) : Promise<IPackageEntity[]>;
}