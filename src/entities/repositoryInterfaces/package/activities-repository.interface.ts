import { ActivityDto } from "../../../shared/dto/packageDto";
import { IActivitiesEntity } from "../../modelsEntity/activites.entity";

export interface IActivitiesRepository {
  create(data : Omit<IActivitiesEntity,'_id'>) : Promise<IActivitiesEntity>;
  save(data: IActivitiesEntity, session?: any): Promise<IActivitiesEntity>;
  saveMany(
    data: ActivityDto[],
    session?: any
  ): Promise<IActivitiesEntity[]>;
  findById(id : string) : Promise<IActivitiesEntity | null>;
  findByIds(ids : string[]) : Promise<IActivitiesEntity[]>;
  update(id : string,data : Partial<IActivitiesEntity>) : Promise<IActivitiesEntity | null>;
  delete(id : string) : Promise<boolean>;
}
