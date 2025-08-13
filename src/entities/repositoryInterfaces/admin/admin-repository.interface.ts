import { IAdminEntity } from "../../modelsEntity/admin.entity";

export interface IAdminRepository {
  findByEmail(email: string): Promise<IAdminEntity | null>;
  findByNumber(phone: string): Promise<IAdminEntity | null>;
}
