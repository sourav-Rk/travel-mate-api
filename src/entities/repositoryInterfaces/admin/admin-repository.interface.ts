import { IAdminEntity } from "../../modelsEntity/admin.entity";
import { IUserEntity } from "../../modelsEntity/user.entity";

export interface IAdminRepository {
  findByEmail(email: string): Promise<IAdminEntity | null>;
  findByNumber(phone: string): Promise<IAdminEntity | null>;
}
