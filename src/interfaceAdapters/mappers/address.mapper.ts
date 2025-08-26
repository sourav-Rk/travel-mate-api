import { IAddressEntity } from "../../entities/modelsEntity/address.entity";
import { IAddressModel } from "../../frameworks/database/models/address.model";

export class AddressMapper {
  static toEntity(doc: IAddressModel): IAddressEntity {
    return {
      address: doc.address,
      city: doc.city,
      country: doc.country,
      pincode: doc.pincode,
      state: doc.state,
      street: doc.street,
      userId: doc.userId.toString(),
    };
  }
}
