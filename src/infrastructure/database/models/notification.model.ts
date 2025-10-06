import mongoose, { Document, ObjectId } from "mongoose";
import { INotificationEntity } from "../../../domain/entities/notification.entity";
import { notificationSchema } from "../schemas/notification.schema";

export interface INotificationModel
  extends Omit<INotificationEntity, "userId" | "_id">,
    Document {
  userId: ObjectId;
}

export const notificationDB = mongoose.model<INotificationModel>(
  "notifications",
  notificationSchema
);
