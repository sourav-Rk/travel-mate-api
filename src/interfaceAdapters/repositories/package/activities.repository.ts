import { injectable } from "tsyringe";
import { IActivitiesRepository } from "../../../entities/repositoryInterfaces/package/activities-repository.interface";
import { IActivitiesEntity } from "../../../entities/modelsEntity/activites.entity";
import { activitiesDB } from "../../../frameworks/database/models/acitivities.model";
import { ActivityDto } from "../../../shared/dto/packageDto";

@injectable()
export class ActivitiesRepository implements IActivitiesRepository {
  async save(
    data: IActivitiesEntity,
    session?: any
  ): Promise<IActivitiesEntity> {
    const options = session ? { session } : {};
    return await activitiesDB
      .create([data], options)
      .then((result) => result[0]);
  }

  async create(data: Omit<IActivitiesEntity, "_id">): Promise<IActivitiesEntity> {
      return await activitiesDB.create(data);
  }

  async saveMany(
    data: ActivityDto[],
    session?: any
  ): Promise<IActivitiesEntity[]> {
    const options = session ? { session, ordered: true } : {};
    console.log(data,"--->datas")
    return await activitiesDB.create(data, options);
  }

  async findById(id: string): Promise<IActivitiesEntity | null> {
    return await activitiesDB.findById(id);
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
