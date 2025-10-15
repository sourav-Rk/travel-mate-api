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
      required: true,
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
