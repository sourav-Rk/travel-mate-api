import { Schema } from "mongoose";

import { IGuideMessageModel } from "../models/guide-message.model";

export const guideMessageSchema = new Schema<IGuideMessageModel>(
  {
    guideChatRoomId: {
      type: Schema.Types.ObjectId,
      ref: "guide_chat_rooms",
      required: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    senderRole: {
      type: String,
      enum: ["client", "guide"],
      required: true,
    },
    message: {
      type: String,
    },
    messageType: {
      type: String,
      enum: ["text", "media", "system", "quote"],
      default: "text",
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
    deliveredTo: [{ type: Schema.Types.ObjectId }],
    readBy: [{ type: Schema.Types.ObjectId }],
    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  { timestamps: true }
);

guideMessageSchema.index({ guideChatRoomId: 1, createdAt: -1 });
guideMessageSchema.index({ messageType: 1, createdAt: -1 });
guideMessageSchema.index({ "metadata.status": 1 });
guideMessageSchema.index({ "metadata.expiresAt": 1 });


