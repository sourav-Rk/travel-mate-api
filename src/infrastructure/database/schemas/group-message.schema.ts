import { Schema } from "mongoose";

import { IGroupMessageModel } from "../models/group-message.model";

export const groupMessageSchema = new Schema<IGroupMessageModel>(
  {
    groupChatId: {
      type: Schema.Types.ObjectId,
      ref: "groupChats",
      required: true
    },
    senderId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "senderType"
    },
    senderType: {
      type: String,
      required: true,
      enum: ["client", "guide", "vendor"]
    },
    message: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent"
    }
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
groupMessageSchema.index({ groupChatId: 1, createdAt: -1 });
groupMessageSchema.index({ senderId: 1 });
groupMessageSchema.index({ createdAt: -1 });
