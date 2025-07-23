import { IClientEntity } from "../../modelsEntity/client.entity";

export interface IUpdateClientDetailsUsecase{
    execute(userId: any, data: Partial<IClientEntity>): Promise<void> ;
}