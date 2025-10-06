import { IPackageEntity } from "../../../../../domain/entities/package.entity";

export interface IGetTrendingPackagesUsecase {
  execute(): Promise<IPackageEntity[]>;
}
