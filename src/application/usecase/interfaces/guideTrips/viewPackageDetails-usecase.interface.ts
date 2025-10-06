import { IPackage } from "../../../dto/response/packageDto";

export interface IViewPackageDetailsUsecase {
  execute(packageId: string): Promise<IPackage>;
}
