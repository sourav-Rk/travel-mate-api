import { injectable } from "tsyringe";
import { IItineraryRepository } from "../../../entities/repositoryInterfaces/package/itinerary-repository.interface";
import { IItineraryEntity } from "../../../entities/modelsEntity/itinerary.entity";
import { itineraryDB } from "../../../frameworks/database/models/itinerary.model";
import { ItineraryEditDto } from "../../../shared/dto/itineraryDto";

@injectable()
export class ItineraryRepository implements IItineraryRepository {
  async save(data: IItineraryEntity, session?: any): Promise<IItineraryEntity> {
    const options = session ? { session } : {};
    return await itineraryDB
      .create([data], options)
      .then((result) => result[0]);
  }

  async findById(id: string): Promise<IItineraryEntity | null> {
      return await itineraryDB.findById(id);
  }

  async findByPackageId(packageId: string): Promise<IItineraryEntity | null> {
      return await itineraryDB.findOne({packageId})
  }

  async update(id: string, data: ItineraryEditDto): Promise<IItineraryEntity | null> {
      return await itineraryDB.findByIdAndUpdate(id,{$set : data},{new: true,runValidators:true})
  }

  async addActivityToDay(itineraryId: string, dayNumber: number, activityId: string): Promise<boolean> {
      const result =  await itineraryDB.updateOne({_id : itineraryId,"days.dayNumber":dayNumber},{$addToSet : {'days.$.activities' : activityId}});
      return result.modifiedCount > 0;
  }

  async removeActivityFromDay(itineraryId: string, dayNumber: number, activityId: string): Promise<boolean> {
      const result = await itineraryDB.updateOne({_id : itineraryId,"days.dayNumber" : dayNumber},{$pull : {'days.$.activities':activityId}});
      return result.modifiedCount > 0;
  }
}
