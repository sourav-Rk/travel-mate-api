import { model, ObjectId } from "mongoose";
import { IRefreshTokenEntity } from "../../../entities/modelsEntity/refresh-token.entity";
import { tokenSchema } from "../schemas/token.schema";

export interface ITokenModel
  extends Omit<IRefreshTokenEntity, "_id" | "userId"> {
  _id: ObjectId;
  userId: ObjectId;
}

export const tokenDB = model("tokens", tokenSchema);
