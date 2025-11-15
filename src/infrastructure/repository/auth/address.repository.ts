import { injectable } from "tsyringe";

import { AddressMapper } from "../../../application/mapper/address.mapper";
import { IAddressEntity } from "../../../domain/entities/address.entity";
import { IAddressRepository } from "../../../domain/repositoryInterfaces/auth/address-repository.interface";
import { addressDB } from "../../database/models/address.model";

@injectable()
export class AddressRepository implements IAddressRepository {
  async save(data: Partial<IAddressEntity>): Promise<IAddressEntity> {
    const modelData = await addressDB.create(data);
    return AddressMapper.toEntity(modelData);
  }

  async findByUserId(userId: string): Promise<IAddressEntity | null> {
    return await addressDB.findOne({ userId });
  }

  async findByIdAndUpdate(
    id: string,
    data: Partial<IAddressEntity>
  ): Promise<void> {
    await addressDB.findByIdAndUpdate(id, data);
  }
}
