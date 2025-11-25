import { Schema } from "mongoose";

import { IGuideChatRoomModel } from "../models/guide-chat-room.model";

export const guideChatRoomSchema = new Schema<IGuideChatRoomModel>(
  {
    roomKey: {
      type: String,
      required: true,
      unique: true,
    },
    participants: [
      {
        userId: { type: Schema.Types.ObjectId, required: true },
        role: {
          type: String,
          enum: ["client", "guide"],
          required: true,
        },
      },
    ],
    latestContext: {
      guideProfileId: { type: String },
      postId: { type: String },
      bookingId: { type: String },
    },
    lastMessage: { type: String },
    lastMessageAt: { type: Date },
  },
  { timestamps: true }
);

guideChatRoomSchema.index({ "participants.userId": 1 });















