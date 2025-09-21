import mongoose, { Document, ObjectId } from "mongoose";

import { IGuideEntity } from "../../../entities/modelsEntity/guide.entity";
import { guideSchema } from "../schemas/guide.schema";

export interface IGuideModel extends Omit<IGuideEntity, "agencyId"|"_id">,Document {
  agencyId: mongoose.Types.ObjectId;
  _id : ObjectId;
}
export const guideDB = mongoose.model("guides", guideSchema);
