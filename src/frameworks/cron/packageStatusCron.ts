import cron from "node-cron";
import { inject, injectable } from "tsyringe";
import { ICron } from "../../entities/cronInterfaces/cron.interface";
import { IUpdatePackageStatusToOngoingUsecase } from "../../entities/useCaseInterfaces/package/updatePackageStausToOngoing-usecase";
import { IProcessExpiredpackagesUsecase } from "../../entities/useCaseInterfaces/package/processExpiredPackages-usecase.interface";

@injectable()
export class PackageStatusCron implements ICron {
  constructor(
    @inject("IUpdatePackageStatusToOngoingUsecase")
    private _updatePackageStatusToOngoingUsecase: IUpdatePackageStatusToOngoingUsecase,

    @inject("IProcessExpiredpackagesUsecase")
    private _processExpiredPackagesUsecase: IProcessExpiredpackagesUsecase
  ) {}

  start(): void {
    cron.schedule("0 0 * * *", async () => {
      console.log("Running Package status cron at 12 AM");
      await this._updatePackageStatusToOngoingUsecase.execute();
      await this._processExpiredPackagesUsecase.execute();
    });
  }
}
