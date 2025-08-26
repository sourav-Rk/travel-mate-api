import { TRole } from "../../../shared/constants";
import { IClientEntity } from "../../modelsEntity/client.entity";

export interface IClientRepository {
  save(data: Partial<IClientEntity>): Promise<IClientEntity>;
  findById(id: string): Promise<IClientEntity | null>;
  findByEmail(email: string): Promise<IClientEntity | null>;
  findByNumber(phone: string): Promise<IClientEntity | null>;
  findByIdAndUpdatePassword(
    id: any,
    password: string
  ): Promise<IClientEntity | null>;
  findByIdAndUpdateStatus(id: string): Promise<boolean>;
  updateClientProfileById(
    id: string,
    data: Partial<IClientEntity>
  ): Promise<void>;
  find(
    searchTerm: string,
    status: string,
    userType: TRole,
    validPageNumber: number,
    validPageSize: number
  ): Promise<{ user: IClientEntity[] | []; total: number }>;
}
