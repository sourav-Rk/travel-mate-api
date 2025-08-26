import { inject, injectable } from "tsyringe";

import { IActivitiesEntity } from "../../entities/modelsEntity/activites.entity";
import { IActivitiesRepository } from "../../entities/repositoryInterfaces/package/activities-repository.interface";
import { IItineraryRepository } from "../../entities/repositoryInterfaces/package/itinerary-repository.interface";
import { IPackageRepository } from "../../entities/repositoryInterfaces/package/package-repository.interface";
import { ICreateActivityUsecase } from "../../entities/useCaseInterfaces/activity/createActivity-usecase.interface";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../shared/constants";
import { CustomError } from "../../shared/utils/error/customError";

@injectable()
export class CreateActivityUsecase implements ICreateActivityUsecase {
  constructor(
    @inject("IActivitiesRepository")
    private _activityRepository: IActivitiesRepository,

    @inject("IItineraryRepository")
    private _itineraryRepository: IItineraryRepository,

    @inject('IPackageRepository')
    private _packageRepository: IPackageRepository 
  ) {}

  async execute(
    itinerayId: string,
    dayNumber: number,
    data: Omit<IActivitiesEntity, "_id">
  ): Promise<void> {
    
    const packageDetails = await this._packageRepository.findByItineraryId(itinerayId);

    if(packageDetails?.status !== "draft"){
      throw new CustomError(HTTP_STATUS.CONFLICT,ERROR_MESSAGE.CANNOT_EDIT_PACKAGE+ `${packageDetails?.status}`);
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
