import { IAdminEntity } from "../../modelsEntity/admin.entity";
import { IBaseRepository } from "../baseRepository.interface";

export interface IAdminRepository extends IBaseRepository<IAdminEntity> {
  findByEmail(email: string): Promise<IAdminEntity | null>;
  findByNumber(phone: string): Promise<IAdminEntity | null>;
}
