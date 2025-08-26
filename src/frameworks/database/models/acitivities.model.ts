import mongoose from "mongoose";

import { IActivitiesEntity } from "../../../entities/modelsEntity/activites.entity";
import { activitiesSchema } from "../schemas/activities.schema";

export interface IActivitiesModel extends Omit<IActivitiesEntity,"_id">,Document {
    _id : mongoose.Types.ObjectId
};
export const activitiesDB =  mongoose.model("activities",activitiesSchema)