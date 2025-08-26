import { injectable } from "tsyringe";

import { IAddressEntity } from "../../../entities/modelsEntity/address.entity";
import { IAddressRepository } from "../../../entities/repositoryInterfaces/auth/address-repository.interface";
import { addressDB } from "../../../frameworks/database/models/address.model";
import { AddressMapper } from "../../mappers/address.mapper";

@injectable()
export class AddressRepository implements IAddressRepository{
    async save(data: Partial<IAddressEntity>): Promise<IAddressEntity> {
        const modelData =  await addressDB.create(data);
        return AddressMapper.toEntity(modelData);
    }

    async findByUserId(userId: string): Promise<IAddressEntity | null> {
        return await addressDB.findOne({userId})
    }

    async findByIdAndUpdate(id: string, data: Partial<IAddressEntity>): Promise<void> {
        await addressDB.findByIdAndUpdate(id,data);
    }
}