import mongoose, { Document, Types } from "mongoose";

import { IGuideMessageEntity } from "../../../domain/entities/guide-message.entity";
import { guideMessageSchema } from "../schemas/guide-message.schema";

export interface IGuideMessageModel
  extends Omit<IGuideMessageEntity, "_id" | "guideChatRoomId" | "senderId" | "deliveredTo" | "readBy">,
    Document {
  _id: Types.ObjectId;
  guideChatRoomId: Types.ObjectId;
  senderId: Types.ObjectId;
  deliveredTo?: Types.ObjectId[];
  readBy?: Types.ObjectId[];
}

export const guideMessageDB = mongoose.model<IGuideMessageModel>(
  "guide_messages",
  guideMessageSchema
);








