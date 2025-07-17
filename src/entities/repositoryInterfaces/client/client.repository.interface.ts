import { IClientEntity } from "../../modelsEntity/client.entity";

export interface IClientRepository {
  save(data: Partial<IClientEntity>): Promise<IClientEntity>;
  findById(id : string) : Promise<IClientEntity | null>;
  findByEmail(email: string): Promise<IClientEntity | null>;
  findByNumber(phone: string): Promise<IClientEntity | null>;
  findByIdAndUpdateStatus(id : string) : Promise<boolean>;
  find(
    filter: any,
    skip: number,
    limit: number
  ): Promise<{ user: IClientEntity[] | []; total: number }>;
}
