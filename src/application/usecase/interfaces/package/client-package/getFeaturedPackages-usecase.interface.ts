import { IPackageEntity } from "../../../../../domain/entities/package.entity";

export interface IGetFeaturedPackagesUsecase {
  execute(packageId: string): Promise<IPackageEntity[]>;
}
