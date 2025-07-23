import { IUserEntity } from "../../modelsEntity/user.entity";

export interface IGoogleUsecase {
    execute(credential : any,client_id : any,role : any) :Promise<Partial<IUserEntity>>;
}