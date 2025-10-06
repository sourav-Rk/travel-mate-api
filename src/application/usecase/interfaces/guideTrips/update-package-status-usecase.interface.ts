import { BOOKINGSTATUS, PackageStatus } from "../../../../shared/constants";

export interface IUpdatePackageStatusUsecaseGuide {
  execute(
    guideId: string,
    packageId: string,
    status: PackageStatus
  ): Promise<void>;
}
