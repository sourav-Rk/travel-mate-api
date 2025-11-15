import { injectable } from "tsyringe";

import { IAdminEntity } from "../../../domain/entities/admin.entity";
import { IAdminRepository } from "../../../domain/repositoryInterfaces/admin/admin-repository.interface";
import { adminDB, IAdminModel } from "../../database/models/admin.model";
import { BaseRepository } from "../baseRepository";

@injectable()
export class AdminRepository
  extends BaseRepository<IAdminModel, IAdminEntity>
  implements IAdminRepository
{
  constructor() {
    super(adminDB);
  }

  async findByEmail(email: string): Promise<IAdminEntity | null> {
    return await adminDB.findOne({ email });
  }

  async findByNumber(phone: string): Promise<IAdminEntity | null> {
    return await adminDB.findOne({ phone });
  }
}
