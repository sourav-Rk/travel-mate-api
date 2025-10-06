import mongoose from "mongoose";

import { IKycEntity } from "../../../domain/entities/kyc.entity";
import { kycSchema } from "../schemas/kyc.schema";

export interface IKycModel extends IKycEntity {}
export const kycDB = mongoose.model("kyc", kycSchema);
