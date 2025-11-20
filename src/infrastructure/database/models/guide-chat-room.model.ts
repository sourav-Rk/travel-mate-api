import mongoose, { Document, Types } from "mongoose";

import { IGuideChatRoomEntity } from "../../../domain/entities/guide-chat-room.entity";
import { guideChatRoomSchema } from "../schemas/guide-chat-room.schema";

export interface IGuideChatRoomModel
  extends Omit<IGuideChatRoomEntity, "_id" | "participants">,
    Document {
  _id: Types.ObjectId;
  participants: {
    userId: Types.ObjectId;
    role: "client" | "guide";
  }[];
}

export const guideChatRoomDB = mongoose.model<IGuideChatRoomModel>(
  "guide_chat_rooms",
  guideChatRoomSchema
);








