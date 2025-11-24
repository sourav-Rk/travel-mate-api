import mongoose, { Document, ObjectId } from "mongoose";

import { IBadgeEntity } from "../../../domain/entities/badge.entity";
import { badgeSchema } from "../schemas/badge.schema";

export interface IBadgeModel extends Omit<IBadgeEntity, "_id" | "id"|"createdBy" | "updatedBy">, Document {
  _id: ObjectId;
  badgeId: string;
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const badgeDB = mongoose.model<IBadgeModel>("badges", badgeSchema);

