import mongoose from "mongoose";
import { IAddressEntity } from "../../../entities/modelsEntity/address.entity";
import { addressSchema } from "../schemas/address.schema";

export interface IAddressModel extends IAddressEntity{}
export const addressDB = mongoose.model("address",addressSchema)