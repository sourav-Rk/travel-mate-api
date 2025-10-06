import mongoose, { Document, ObjectId } from "mongoose";

import { IAdminEntity } from "../../../domain/entities/admin.entity";
import { adminSchema } from "../schemas/admin.schema";

export interface IAdminModel extends Omit<IAdminEntity, "_id">, Document {
  _id: ObjectId;
}

export const adminDB = mongoose.model("admins", adminSchema);
