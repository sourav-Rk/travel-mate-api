import mongoose from "mongoose";
import { IVendorEntity } from "../../../entities/modelsEntity/vendor.entity";
import { vendorSchema } from "../schemas/vendor.schema";

export interface IVendorModel extends IVendorEntity{};
export const vendorDB = mongoose.model("vendors",vendorSchema)