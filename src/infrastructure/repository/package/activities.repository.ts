import { ClientSession } from "mongoose";
import { injectable } from "tsyringe";

import { ActivityDto } from "../../../application/dto/response/packageDto";
import { ActivityMapper } from "../../../application/mapper/activity.mapper";
import { IActivitiesEntity } from "../../../domain/entities/activites.entity";
import { IActivitiesRepository } from "../../../domain/repositoryInterfaces/package/activities-repository.interface";
import {
  activitiesDB,
  IActivitiesModel,
} from "../../database/models/acitivities.model";
import { BaseRepository } from "../baseRepository";

@injectable()
export class ActivitiesRepository
  extends BaseRepository<IActivitiesModel, IActivitiesEntity>
  implements IActivitiesRepository
{
  constructor() {
    super(activitiesDB, ActivityMapper.toEntity);
  }

  async save(
    data: IActivitiesEntity,
    session?: ClientSession
  ): Promise<IActivitiesEntity> {
    const options = session ? { session } : {};
    const modelData = await activitiesDB
      .create([data], options)
      .then((result) => result[0]);

    return ActivityMapper.toEntity(modelData);
  }

  async create(
    data: Omit<IActivitiesEntity, "_id">
  ): Promise<IActivitiesEntity> {
    const modelData = await activitiesDB.create(data);
    return ActivityMapper.toEntity(modelData);
  }

  async saveMany(
    data: ActivityDto[],
    session?: ClientSession
  ): Promise<IActivitiesEntity[]> {
    const options = session ? { session, ordered: true } : {};
    console.log(data, "--->datas");
    const modelData = await activitiesDB.create(data, options);
    return modelData.map((doc) => ActivityMapper.toEntity(doc));
  }

  async findByIds(ids: string[]): Promise<IActivitiesEntity[]> {
    return await activitiesDB.find({ _id: { $in: ids } });
  }

  async update(
    id: string,
    data: Partial<IActivitiesEntity>
  ): Promise<IActivitiesEntity | null> {
    return await activitiesDB.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );
  }

  async delete(id: string): Promise<boolean> {
    const result = await activitiesDB.findByIdAndDelete(id);
    return !!result;
  }
}
