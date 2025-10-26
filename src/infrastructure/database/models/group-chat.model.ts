import mongoose, { Document, ObjectId } from "mongoose";
import { IGroupChatEntity } from "../../../domain/entities/group-chat.entity";
import { groupChatSchema } from "../schemas/group-chat.schema";

export interface IGroupChatModel
  extends Omit<IGroupChatEntity, "_id">,
    Document {
  userId: ObjectId;
}

export const groupChatDB = mongoose.model<IGroupChatModel>(
  "groupChats",
  groupChatSchema
);
