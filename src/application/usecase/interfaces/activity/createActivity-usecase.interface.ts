import { IActivitiesEntity } from "../../../../domain/entities/activites.entity";

export interface ICreateActivityUsecase {
  execute(
    itinerayId: string,
    dayNumber: number,
    data: Omit<IActivitiesEntity, "_id">
  ): Promise<void>;
}
