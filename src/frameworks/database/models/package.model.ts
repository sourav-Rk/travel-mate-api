import mongoose from "mongoose";

import { IPackageEntity } from "../../../entities/modelsEntity/package.entity";
import { packageSchema } from "../schemas/package.schema";

export interface IPackageModel extends IPackageEntity{}
export const packageDB = mongoose.model("packages",packageSchema)