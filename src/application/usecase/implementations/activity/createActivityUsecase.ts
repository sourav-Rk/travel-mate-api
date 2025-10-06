import { inject, injectable } from "tsyringe";

import { IActivitiesEntity } from "../../../../domain/entities/activites.entity";
import { IActivitiesRepository } from "../../../../domain/repositoryInterfaces/package/activities-repository.interface";
import { IItineraryRepository } from "../../../../domain/repositoryInterfaces/package/itinerary-repository.interface";
import { IPackageRepository } from "../../../../domain/repositoryInterfaces/package/package-repository.interface";
import { ICreateActivityUsecase } from "../../interfaces/activity/createActivity-usecase.interface";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../../../shared/constants";
import { CustomError } from "../../../../domain/errors/customError";

@injectable()
export class CreateActivityUsecase implements ICreateActivityUsecase {
  constructor(
    @inject("IActivitiesRepository")
    private _activityRepository: IActivitiesRepository,

    @inject("IItineraryRepository")
    private _itineraryRepository: IItineraryRepository,

    @inject("IPackageRepository")
    private _packageRepository: IPackageRepository
  ) {}

  async execute(
    itinerayId: string,
    dayNumber: number,
    data: Omit<IActivitiesEntity, "_id">
  ): Promise<void> {
    const packageDetails = await this._packageRepository.findByItineraryId(
      itinerayId
    );

    if (packageDetails?.status !== "draft") {
      throw new CustomError(
        HTTP_STATUS.CONFLICT,
        ERROR_MESSAGE.CANNOT_EDIT_PACKAGE + `${packageDetails?.status}`
      );
    }

    const newActivity = await this._activityRepository.create(data);

    if (itinerayId && dayNumber) {
      await this._itineraryRepository.addActivityToDay(
        itinerayId,
        dayNumber,
        newActivity._id!
      );
    }
  }
}
