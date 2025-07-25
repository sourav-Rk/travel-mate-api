import { injectable } from "tsyringe";
import { IAddressRepository } from "../../../entities/repositoryInterfaces/auth/address-repository.interface";
import { IAddressEntity } from "../../../entities/modelsEntity/address.entity";
import { addressDB } from "../../../frameworks/database/models/address.model";

@injectable()
export class AddressRepository implements IAddressRepository{
    async save(data: Partial<IAddressEntity>): Promise<IAddressEntity> {
        return await addressDB.create(data)
    }

    async findByUserId(userId: string): Promise<IAddressEntity | null> {
        return await addressDB.findOne({userId})
    }
}