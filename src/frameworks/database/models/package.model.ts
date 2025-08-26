import mongoose, { Document } from "mongoose";

import { IPackageEntity } from "../../../entities/modelsEntity/package.entity";
import { packageSchema } from "../schemas/package.schema";

export interface IPackageModel
  extends Omit<IPackageEntity, "_id" | "agencyId">,
    Document {
  agencyId: mongoose.Types.ObjectId;
}
export const packageDB = mongoose.model("packages", packageSchema);
