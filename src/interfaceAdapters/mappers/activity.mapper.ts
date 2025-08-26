import { IActivitiesEntity } from "../../entities/modelsEntity/activites.entity";
import { IActivitiesModel } from "../../frameworks/database/models/acitivities.model";

export class ActivityMapper {
  static toEntity(doc: IActivitiesModel): IActivitiesEntity {
    return {
      _id: String(doc._id),
      category: doc.category,
      dayNumber: doc.dayNumber,
      description: doc.description,
      duration: doc.duration,
      name: doc.name,
      priceIncluded: doc.priceIncluded,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
