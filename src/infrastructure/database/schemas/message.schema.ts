import { Schema } from "mongoose";

import { IMessageModel } from "../models/message.model";

export const messageSchema = new Schema<IMessageModel>(
  {
    chatRoomId: {
      type: Schema.Types.ObjectId,
      ref: "ChatRoom",
      required: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      required: true
    },
    senderType: {
      type: String,
      enum: ["client", "guide", "vendor"],
      required: true,
    },
    receiverId: { type: Schema.Types.ObjectId, required: true },
    recieverType: {
      type: String,
      enum: ["client", "guide", "vendor"],
      required: true,
    },
    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent",
    },
    readAt: {
      type: Date,
    },
    message: {
      type: String,
      required: false,
      default: "",
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
    contextType: {
      type: String,
      enum: ["vendor_client", "guide_client", "client_client"],
      required: true,
    },
    contextId :{
      type : String
    },
    deliveredTo: [{ type: Schema.Types.ObjectId }],
  },
  { timestamps: true }
);
