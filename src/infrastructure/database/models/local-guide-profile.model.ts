import mongoose, { Document, ObjectId } from "mongoose";

import { ILocalGuideProfileEntity } from "../../../domain/entities/local-guide-profile.entity";
import { localGuideProfileSchema } from "../schemas/local-guide-profile.schema";

export interface ILocalGuideProfileModel
  extends Omit<ILocalGuideProfileEntity, "_id" | "userId">,
    Document {
  _id: ObjectId;
  userId: mongoose.Types.ObjectId;
}

export const localGuideProfileDB = mongoose.model<ILocalGuideProfileModel>(
  "local_guide_profiles",
  localGuideProfileSchema
);

