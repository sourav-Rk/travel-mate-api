import  { Schema } from "mongoose";

import { IGroupChatModel } from "../models/group-chat.model";


export const groupChatSchema = new Schema<IGroupChatModel>(
  {
    packageId: {
      type: String,
      ref: "packages", 
      required: true,
      unique: true 
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    members: [{
      userId: {
        type: Schema.Types.ObjectId,
        required: true,
        refPath: "members.userType" 
      },
      userType: {
        type: String,
        required: true,
        enum: ["client", "guide", "vendor"]
      },
      _id: false 
    }],
    lastMessage: {
      type: String,
      default: null
    },
    lastMessageAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
  }
);

groupChatSchema.index({ packageId: 1 });
groupChatSchema.index({ "members.userId": 1 });
groupChatSchema.index({ updatedAt: -1 });
