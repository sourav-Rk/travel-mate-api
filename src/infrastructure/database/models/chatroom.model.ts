import mongoose, { Document, ObjectId, Types } from "mongoose";
import { IChatRoomEntity } from "../../../domain/entities/chatroom.entity";
import { chatRoomSchema } from "../schemas/chatroom.schema";

export interface IChatroomModel
  extends Omit<IChatRoomEntity, "_id" | "participants">,
    Document {
  _id: ObjectId;
  participants: {
    userId: Types.ObjectId;
    userType: "client" | "guide" | "vendor";
  }[];
}

export const chatRoomDB = mongoose.model("chatRooms", chatRoomSchema);
