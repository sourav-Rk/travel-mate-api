import { IClientEntity } from "../../modelsEntity/client.entity";

export interface IGetClientDetailsUsecase {
    execute(userId : string) : Promise<IClientEntity | null>;
}