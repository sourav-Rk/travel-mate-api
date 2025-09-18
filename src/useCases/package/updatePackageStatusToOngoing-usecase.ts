import { inject, injectable } from "tsyringe";
import { IUpdatePackageStatusToOngoingUsecase } from "../../entities/useCaseInterfaces/package/updatePackageStausToOngoing-usecase";
import { IPackageRepository } from "../../entities/repositoryInterfaces/package/package-repository.interface";
import { BOOKINGSTATUS } from "../../shared/constants";

@injectable()
export class UpdatePackageStatusToOngoing
  implements IUpdatePackageStatusToOngoingUsecase
{
  constructor(
    @inject("IPackageRepository")
    private _packageRepository: IPackageRepository
  ) {}

  async execute(): Promise<void> {
    const today = new Date();

    const todayUTC = new Date(
      Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())
    );

    const packageStartingToday =
      await this._packageRepository.findByPackagesByTodayDate(todayUTC);

    for (const pkg of packageStartingToday) {
      if (pkg.status !== "ongoing" && pkg.status === "applications_closed") {
        pkg.status = "ongoing";
        await this._packageRepository.updatePackageStatus(pkg?._id!, "ongoing");
        console.log(`package ${pkg.packageName} marked as ongoing`);
      }
    }
  }
}
