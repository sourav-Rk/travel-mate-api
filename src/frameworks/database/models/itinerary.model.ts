import mongoose from "mongoose";
import { IItineraryEntity } from "../../../entities/modelsEntity/itinerary.entity";
import { itinerarySchema } from "../schemas/itinerary.schema";

export interface IItineraryModel extends IItineraryEntity{}
export const itineraryDB = mongoose.model("itinerarys",itinerarySchema)