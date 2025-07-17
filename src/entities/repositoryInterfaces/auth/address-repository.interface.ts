import { IAddressEntity } from "../../modelsEntity/address.entity";

export interface IAddressRepository{
    save(data : Partial<IAddressEntity>) : Promise<IAddressEntity>;
    findByUserId(vendorId : string) : Promise<IAddressEntity | null>;
}