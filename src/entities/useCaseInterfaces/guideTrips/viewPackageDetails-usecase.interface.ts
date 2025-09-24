import { IPackage } from "../../../shared/dto/packageDto";

export interface IViewPackageDetailsUsecase {
  execute(packageId: string): Promise<IPackage>;
}
