import mongoose, { Document } from "mongoose";

import { IItineraryEntity } from "../../../domain/entities/itinerary.entity";
import { itinerarySchema } from "../schemas/itinerary.schema";

export interface IItineraryModel
  extends Omit<IItineraryEntity, "_id" | "packageId">,
    Document {
  _id: mongoose.Types.ObjectId;
  packageId: mongoose.Types.ObjectId;
}
export const itineraryDB = mongoose.model("itinerarys", itinerarySchema);
