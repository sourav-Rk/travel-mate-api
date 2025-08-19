import { ItineraryEditDto } from "../../../shared/dto/itineraryDto";
import { IItineraryEntity } from "../../modelsEntity/itinerary.entity";

export interface IItineraryRepository {
  findById(id: string): Promise<IItineraryEntity | null>;
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
