import { TRole } from "../../../../shared/constants";
import { IPackage } from "../../../dto/response/packageDto";

export interface IGetPackageDetailsUsecase {
  execute(
    userType: TRole,
    userId: string,
    packageId: string
  ): Promise<IPackage>;
}
