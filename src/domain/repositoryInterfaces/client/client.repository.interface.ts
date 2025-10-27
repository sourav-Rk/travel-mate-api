import { TRole } from "../../../shared/constants";
import { IClientEntity } from "../../entities/client.entity";
import { IBaseRepository } from "../baseRepository.interface";

export interface IClientRepository extends IBaseRepository<IClientEntity> {
  findByEmail(email: string): Promise<IClientEntity | null>;
  findByNumber(phone: string): Promise<IClientEntity | null>;
  findByIdAndUpdatePassword(
    id: string,
    password: string
  ): Promise<IClientEntity | null>;
  findByIdAndUpdateStatus(id: string): Promise<boolean>;
  find(
    searchTerm: string,
    status: string,
    userType: TRole,
    validPageNumber: number,
    validPageSize: number
  ): Promise<{ user: IClientEntity[] | []; total: number }>;
}
