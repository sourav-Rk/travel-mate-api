import mongoose, { Document } from "mongoose";

import { IAddressEntity } from "../../../entities/modelsEntity/address.entity";
import { addressSchema } from "../schemas/address.schema";

export interface IAddressModel extends Omit<IAddressEntity,"userId">, Document {
    userId : mongoose.Types.ObjectId
}
export const addressDB = mongoose.model("address",addressSchema)