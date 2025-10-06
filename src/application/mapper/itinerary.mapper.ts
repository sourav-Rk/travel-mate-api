import { IItineraryEntity } from "../../domain/entities/itinerary.entity";
import { IItineraryModel } from "../../infrastructure/database/models/itinerary.model";

export class ItineraryMapper {
  static toEntity(doc: IItineraryModel): IItineraryEntity {
    return {
      _id: String(doc._id),
      packageId: String(doc.packageId),
      days: doc.days,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
