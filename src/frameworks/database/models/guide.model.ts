import mongoose from "mongoose";
import { IGuideEntity } from "../../../entities/modelsEntity/guide.entity";
import { guideSchema } from "../schemas/guide.schema";

export interface IGuideModel extends IGuideEntity{}
export const guideDB = mongoose.model("guides",guideSchema)