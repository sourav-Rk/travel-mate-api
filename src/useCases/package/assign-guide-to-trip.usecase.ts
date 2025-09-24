import { inject, injectable } from "tsyringe";
import { IAssignGuideToTripUsecase } from "../../entities/useCaseInterfaces/package/assign-guide-to-trip-usecase.interface";
import { IGuideRepository } from "../../entities/repositoryInterfaces/guide/guide-repository.interface";
import { IPackageRepository } from "../../entities/repositoryInterfaces/package/package-repository.interface";
import { ValidationError } from "../../shared/utils/error/validationError";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../shared/constants";
import { NotFoundError } from "../../shared/utils/error/notFoundError";
import { CustomError } from "../../shared/utils/error/customError";

@injectable()
export class AssignGuideToTripUsecase implements IAssignGuideToTripUsecase {
  constructor(
    @inject("IGuideRepository")
    private _guideRepository: IGuideRepository,

    @inject("IPackageRepository")
    private _packageRepository: IPackageRepository
  ) {}

  async execute(packageId: string, guideId: string): Promise<void> {
    //package and guide validation
    if (!guideId || !packageId) {
      throw new ValidationError(ERROR_MESSAGE.ID_REQUIRED);
    }

    const pkg = await this._packageRepository.findByPackageId(packageId);
    if (!pkg) throw new NotFoundError(ERROR_MESSAGE.PACKAGE_NOT_FOUND);

    const guide = await this._guideRepository.findById(guideId);
    if (!guide) throw new NotFoundError(ERROR_MESSAGE.GUIDE_NOT_FOUND);

    
    //check already assigned
    if(pkg.guideId){
      throw new CustomError(HTTP_STATUS.CONFLICT,ERROR_MESSAGE.GUIDE_ALREADY_ASSIGNED);
    }

    //check guide belongs to the agency
    if (pkg.agencyId.toString() !== guide.agencyId.toString()) {
      throw new CustomError(
        HTTP_STATUS.CONFLICT,
        ERROR_MESSAGE.GUIDE_AND_AGENCY_CONFLICT
      );
    }

    //Check package is not blocked or closed
    if (pkg.isBlocked)
      throw new CustomError(
        HTTP_STATUS.CONFLICT,
        ERROR_MESSAGE.PACKAGE_BLOCKED
      );
    if (pkg.status === "completed")
      throw new CustomError(
        HTTP_STATUS.CONFLICT,
        ERROR_MESSAGE.PACKAGE_ALREADY_COMPLETED
      );
    if (pkg.status !== "applications_closed")
      throw new CustomError(
        HTTP_STATUS.CONFLICT,
        ERROR_MESSAGE.ONLY_ASSIGN_GUIDE_IF_PACKAGE_IS_CLOSED
      );

    //chekck for date conflicts
    const assignedTrips = await this._packageRepository.findByGuideId(guideId);

    const isConflict = assignedTrips.some((trip) => {
      return trip.startDate <= pkg.endDate && trip.endDate >= pkg.startDate;
    });

    if (isConflict) {
      throw new CustomError(
        HTTP_STATUS.CONFLICT,
        ERROR_MESSAGE.GUIDE_ASSIGNED_FOR_ANOTHER_TRIP
      );
    }

    //Asign guide
    await this._packageRepository.update(pkg._id, { guideId });

    //add trips to assigned trips
    await this._guideRepository.updateById(guideId, {
      isAvailable: false,
      assignedTrips: [pkg.packageId!],
    });
  }
}
