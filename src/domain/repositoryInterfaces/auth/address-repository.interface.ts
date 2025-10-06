import { IAddressEntity } from "../../entities/address.entity";

export interface IAddressRepository {
  save(data: Partial<IAddressEntity>): Promise<IAddressEntity>;
  findByUserId(vendorId: string): Promise<IAddressEntity | null>;
  findByIdAndUpdate(id: string, data: Partial<IAddressEntity>): Promise<void>;
}
