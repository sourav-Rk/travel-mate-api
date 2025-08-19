import { IPackage } from "../../../shared/dto/packageDto";

export interface IGetPackageDetailsUsecase {
    execute(agencyId : string, packageId : string) : Promise<IPackage>;
}