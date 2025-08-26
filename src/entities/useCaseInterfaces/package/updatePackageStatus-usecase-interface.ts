import { PackageStatus } from "../../../shared/constants";

export interface IUpdatePackageStatusUsecase {
    execute(packageId : string,status : PackageStatus) : Promise<void>;
}