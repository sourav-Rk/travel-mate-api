import mongoose, { Schema } from "mongoose";
import { IChatroomModel } from "../models/chatroom.model";

export const chatRoomSchema = new mongoose.Schema<IChatroomModel>(
  {
    participants: [
      {
        userId: { type: Schema.Types.ObjectId, required: true },
        userType: {
          type: String,
          enum: ["client", "guide", "vendor"],
          required: true,
        },
      },
    ],
    contextType: {
      type: String,
      enum: ["vendor_client", "guide_client", "client_client"],
      required: true,
    },
    contextId :{
      type : String
    },
    lastMessage: {
      type: String,
    },
    lastMessageAt: {
      type: Date,
    },
  },
  { timestamps: true }
);


chatRoomSchema.index({ contextType: 1, contextId: 1 });