import { IPackageEntity } from "../../../../domain/entities/package.entity";

export interface IUpdatePackageBasicDetailsUsecase {
  execute(
    agencyId: string,
    packageId: string,
    data: IPackageEntity
  ): Promise<void>;
}
