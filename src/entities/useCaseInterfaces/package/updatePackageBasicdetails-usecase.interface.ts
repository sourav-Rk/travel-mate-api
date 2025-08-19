import { IPackageEntity } from "../../modelsEntity/package.entity";

export interface IUpdatePackageBasicDetailsUsecase {
    execute(agencyId : string,packageId : string,data : IPackageEntity) : Promise<void>;
}