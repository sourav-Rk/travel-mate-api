import { IPackage } from "../../../../dto/response/packageDto";

export interface IGetPackageDetailsClientUsecase {
  execute(packageId: string): Promise<IPackage>;
}
