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
      required: false,
      default: "",
      trim: true
    },
    mediaAttachments: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
        type: {
          type: String,
          enum: ["image", "video", "file", "voice"],
          required: true,
        },
        fileName: { type: String },
        fileSize: { type: Number },
        mimeType: { type: String },
        thumbnailUrl: { type: String },
        duration: { type: Number },
      },
    ],
    messageType: {
      type: String,
      enum: ["text", "media", "mixed"],
      default: "text",
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
