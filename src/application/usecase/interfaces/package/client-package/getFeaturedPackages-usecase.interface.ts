import { IPackageEntity } from "../../../../../domain/entities/package.entity";

export interface IGetFeaturedPackagesUsecase {
  execute(packageId: any): Promise<IPackageEntity[]>;
}
