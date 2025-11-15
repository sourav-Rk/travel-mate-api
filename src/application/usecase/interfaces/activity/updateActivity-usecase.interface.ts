import { IActivitiesEntity } from "../../../../domain/entities/activites.entity";

export interface IUpdateActivityUsecase {
  execute(id: string, data: Partial<IActivitiesEntity>): Promise<void>;
}
