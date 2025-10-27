import { ClientSession } from "mongoose";
import { injectable } from "tsyringe";

import { ItineraryEditDto } from "../../../application/dto/response/itineraryDto";
import { ItineraryMapper } from "../../../application/mapper/itinerary.mapper";
import { IItineraryEntity } from "../../../domain/entities/itinerary.entity";
import { IItineraryRepository } from "../../../domain/repositoryInterfaces/package/itinerary-repository.interface";
import {
  IItineraryModel,
  itineraryDB,
} from "../../database/models/itinerary.model";
import { BaseRepository } from "../baseRepository";

@injectable()
export class ItineraryRepository
  extends BaseRepository<IItineraryModel, IItineraryEntity>
  implements IItineraryRepository
{
  constructor() {
    super(itineraryDB, ItineraryMapper.toEntity);
  }

  async save(data: IItineraryEntity, session?: ClientSession): Promise<IItineraryEntity> {
    const options = session ? { session } : {};
    const modelData = await itineraryDB
      .create([data], options)
      .then((result) => result[0]);

    return ItineraryMapper.toEntity(modelData);
  }

  async findByPackageId(packageId: string): Promise<IItineraryEntity | null> {
    return await itineraryDB.findOne({ packageId });
  }

  async update(
    id: string,
    data: ItineraryEditDto
  ): Promise<IItineraryEntity | null> {
    return await itineraryDB.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );
  }

  async addActivityToDay(
    itineraryId: string,
    dayNumber: number,
    activityId: string
  ): Promise<boolean> {
    const result = await itineraryDB.updateOne(
      { _id: itineraryId, "days.dayNumber": dayNumber },
      { $addToSet: { "days.$.activities": activityId } }
    );
    return result.modifiedCount > 0;
  }

  async removeActivityFromDay(
    itineraryId: string,
    dayNumber: number,
    activityId: string
  ): Promise<boolean> {
    const result = await itineraryDB.updateOne(
      { _id: itineraryId, "days.dayNumber": dayNumber },
      { $pull: { "days.$.activities": activityId } }
    );
    return result.modifiedCount > 0;
  }
}
