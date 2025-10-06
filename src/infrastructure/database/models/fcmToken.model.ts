import mongoose, { Document, ObjectId } from "mongoose";
import { IFCMTokenEntity } from "../../../domain/entities/fcmToken.entity";
import { fcmTokenSchema } from "../schemas/fcmToken.schema";

export interface IFcmTokenModel
  extends Omit<IFCMTokenEntity, "userId" | "_id">,
    Document<ObjectId> {
  userId: ObjectId;
}

export const fcmTokenDb = mongoose.model<IFcmTokenModel>(
  "fcmTokens",
  fcmTokenSchema
);
