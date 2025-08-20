import { TRole } from "../../../shared/constants";
import { IPackage } from "../../../shared/dto/packageDto";

export interface IGetPackageDetailsUsecase {
    execute(userType : TRole,userId : string, packageId : string) : Promise<IPackage>;
}