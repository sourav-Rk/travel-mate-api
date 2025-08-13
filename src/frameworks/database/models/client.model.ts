import mongoose from "mongoose";

import { IClientEntity } from "../../../entities/modelsEntity/client.entity";
import { clientSchema } from "../schemas/client.schema";


export interface IClientModel extends IClientEntity{}
export const clientDB = mongoose.model("clients",clientSchema)