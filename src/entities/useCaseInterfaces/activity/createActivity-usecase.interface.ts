import { IActivitiesEntity } from "../../modelsEntity/activites.entity";

export interface ICreateActivityUsecase {
    execute(itinerayId : string,dayNumber : number, data : Omit<IActivitiesEntity,'_id'>) : Promise<void>;
}