import { ItineraryEditDto } from "../../../shared/dto/itineraryDto";
import { IItineraryEntity } from "../../modelsEntity/itinerary.entity";
import { IBaseRepository } from "../baseRepository.interface";

export interface IItineraryRepository extends IBaseRepository<IItineraryEntity> {
  findByPackageId(packageId: string): Promise<IItineraryEntity | null>;
  save(data: IItineraryEntity, session?: any): Promise<IItineraryEntity>;
  update(
    id: string,
    data: ItineraryEditDto
  ): Promise<IItineraryEntity | null>;
  addActivityToDay(
    itineraryId: string,
    dayNumber: number,
    activityId: string
  ): Promise<boolean>;
  removeActivityFromDay(
    itineraryId: string,
    dayNumber: number,
    activityId: string
  ): Promise<boolean>;
}
