import mongoose, { Document, ObjectId } from "mongoose";

import { IPackageEntity } from "../../../entities/modelsEntity/package.entity";
import { packageSchema } from "../schemas/package.schema";

export interface IPackageModel
  extends Omit<IPackageEntity, "_id" | "agencyId" | "guideId">,
    Document {
  agencyId: mongoose.Types.ObjectId;
  guideId : ObjectId;
}
export const packageDB = mongoose.model("packages", packageSchema);
