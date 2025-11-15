import mongoose, { Document, Types } from "mongoose";

import { IMessageEntity } from "../../../domain/entities/message.entity";
import { messageSchema } from "../schemas/message.schema";

export interface IMessageModel
  extends Omit<
      IMessageEntity,
      "_id" | "senderId" | "receiverId" | "deliveredTo" | "chatRoomId"
    >,
    Document {
  _id: Types.ObjectId;
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  deliveredTo?: Types.ObjectId[];
  chatRoomId: Types.ObjectId;
  mediaAttachments?: Array<{
    url: string;
    publicId: string;
    type: "image" | "video" | "file" | "voice";
    fileName?: string;
    fileSize?: number;
    mimeType?: string;
    thumbnailUrl?: string;
    duration?: number;
  }>;
}

export const messageDB = mongoose.model<IMessageModel>("messages",messageSchema);
