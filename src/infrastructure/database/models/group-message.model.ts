import mongoose, { Document, Types } from "mongoose";

import { IGroupMessageEntity } from "../../../domain/entities/group-message.entity";
import { groupMessageSchema } from "../schemas/group-message.schema";

export interface IGroupMessageModel
  extends Omit<IGroupMessageEntity, "_id" | "groupChatId" | "senderId">,
    Document {
  _id: Types.ObjectId;
  groupChatId: Types.ObjectId;
  senderId: Types.ObjectId;
}

export const groupMessageDB = mongoose.model<IGroupMessageModel>(
  "groupMessages",
  groupMessageSchema
);
