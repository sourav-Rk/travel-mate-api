import { ActivityDto } from "../../../application/dto/response/packageDto";
import { IActivitiesEntity } from "../../entities/activites.entity";
import { IBaseRepository } from "../baseRepository.interface";

export interface IActivitiesRepository
  extends IBaseRepository<IActivitiesEntity> {
  create(data: Omit<IActivitiesEntity, "_id">): Promise<IActivitiesEntity>;
  save(data: IActivitiesEntity, session?: any): Promise<IActivitiesEntity>;
  saveMany(data: ActivityDto[], session?: any): Promise<IActivitiesEntity[]>;
  findByIds(ids: string[]): Promise<IActivitiesEntity[]>;
  update(
    id: string,
    data: Partial<IActivitiesEntity>
  ): Promise<IActivitiesEntity | null>;
  delete(id: string): Promise<boolean>;
}
