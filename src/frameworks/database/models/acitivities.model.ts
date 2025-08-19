import mongoose from "mongoose";
import { IActivitiesEntity } from "../../../entities/modelsEntity/activites.entity";
import { activitiesSchema } from "../schemas/activities.schema";

export interface IActivitiesModel extends IActivitiesEntity {};
export const activitiesDB =  mongoose.model("activities",activitiesSchema)