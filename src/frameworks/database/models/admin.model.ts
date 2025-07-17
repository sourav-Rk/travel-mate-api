import mongoose from "mongoose";

import { IAdminEntity } from "../../../entities/modelsEntity/admin.entity";
import { adminSchema } from "../schemas/admin.schema";

export interface IAdminModel extends IAdminEntity {}

export const adminDB = mongoose.model("admins",adminSchema);