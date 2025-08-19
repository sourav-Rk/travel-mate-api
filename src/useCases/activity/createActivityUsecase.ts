import { inject, injectable } from "tsyringe";
import { ICreateActivityUsecase } from "../../entities/useCaseInterfaces/activity/createActivity-usecase.interface";
import { IActivitiesRepository } from "../../entities/repositoryInterfaces/package/activities-repository.interface";
import { IActivitiesEntity } from "../../entities/modelsEntity/activites.entity";
import { IItineraryRepository } from "../../entities/repositoryInterfaces/package/itinerary-repository.interface";

@injectable()
export class CreateActivityUsecase implements ICreateActivityUsecase {
  constructor(
    @inject("IActivitiesRepository")
    private _activityRepository: IActivitiesRepository,

    @inject("IItineraryRepository")
    private _itineraryRepository: IItineraryRepository
  ) {}

  async execute(
    itinerayId: string,
    dayNumber: number,
    data: Omit<IActivitiesEntity, "_id">
  ): Promise<void> {
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
