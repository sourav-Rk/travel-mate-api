import mongoose, { Document, ObjectId } from "mongoose";

import { IClientEntity } from "../../../domain/entities/client.entity";
import { clientSchema } from "../schemas/client.schema";

export interface IClientModel extends Omit<IClientEntity, "_id">, Document {
  _id: ObjectId;
}
export const clientDB = mongoose.model("clients", clientSchema);
