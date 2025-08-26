import mongoose, { Document } from "mongoose";

import { IGuideEntity } from "../../../entities/modelsEntity/guide.entity";
import { guideSchema } from "../schemas/guide.schema";

export interface IGuideModel extends Omit<IGuideEntity, "agencyId"> {
  agencyId: mongoose.Types.ObjectId;
}
export const guideDB = mongoose.model("guides", guideSchema);
