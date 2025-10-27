import { inject, injectable } from "tsyringe";

import { CustomError } from "../../../../domain/errors/customError";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ValidationError } from "../../../../domain/errors/validationError";
import { IActivitiesRepository } from "../../../../domain/repositoryInterfaces/package/activities-repository.interface";
import { IItineraryRepository } from "../../../../domain/repositoryInterfaces/package/itinerary-repository.interface";
import { IPackageRepository } from "../../../../domain/repositoryInterfaces/package/package-repository.interface";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../../../shared/constants";
import { PackageStatus } from "../../../dto/request/package.dto";
import { IDeleteActivityUsecase } from "../../interfaces/activity/deleteActivity-usecase.interface";

@injectable()
export class DeleteActivityUsecase implements IDeleteActivityUsecase {
  constructor(
    @inject("IActivitiesRepository")
    private _activitiesRepository: IActivitiesRepository,

    @inject("IItineraryRepository")
    private _itinerayRepository: IItineraryRepository,

    @inject("IPackageRepository")
    private _packageRepository: IPackageRepository
  ) {}

  async execute(
    itineraryId: string,
    dayNumber: number,
    id: string
  ): Promise<void> {
    if (!id || !itineraryId) {
      throw new ValidationError(ERROR_MESSAGE.ID_REQUIRED);
    }

    const packageDetails = await this._packageRepository.findByItineraryId(
      itineraryId
    );

    if (packageDetails?.status !== PackageStatus.DRAFT) {
      throw new CustomError(
        HTTP_STATUS.CONFLICT,
        ERROR_MESSAGE.CANNOT_EDIT_PACKAGE + ` ${packageDetails?.status}`
      );
    }

    const activityExist = await this._activitiesRepository.findById(id);
    const itineraryExist = await this._itinerayRepository.findById(itineraryId);
    if (!activityExist) {
      throw new NotFoundError(ERROR_MESSAGE.ACTIVITY_NOT_EXIST);
    }
    if (!itineraryExist) {
      throw new NotFoundError(ERROR_MESSAGE.ITINERARY_NOT_FOUND);
    }

    await this._itinerayRepository.removeActivityFromDay(
      itineraryId,
      dayNumber,
      id
    );

    await this._activitiesRepository.delete(id);
  }
}
