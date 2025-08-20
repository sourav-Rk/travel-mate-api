import { IPackage } from "../../../../shared/dto/packageDto";

export interface IGetPackageDetailsClientUsecase {
    execute(packageId : string) : Promise<IPackage>;
}