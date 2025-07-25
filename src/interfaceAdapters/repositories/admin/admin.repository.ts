import { injectable } from "tsyringe";
import { IAdminRepository } from "../../../entities/repositoryInterfaces/admin/admin-repository.interface";
import { IAdminEntity } from "../../../entities/modelsEntity/admin.entity";
import { adminDB } from "../../../frameworks/database/models/admin.model";

@injectable()
export class AdminRepository implements IAdminRepository{
    async findByEmail(email: string): Promise<IAdminEntity | null> {
        return await adminDB.findOne({email})
    }

    async findByNumber(phone: string): Promise<IAdminEntity | null> {
        return await adminDB.findOne({phone})
    }
}