import mongoose from "mongoose";
import { INotificationModel } from "../models/notification.model";

export const notificationSchema = new mongoose.Schema<INotificationModel>({
  userId: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  title: {
    type: String,
  },
  message: {
    type: String,
    required: true,
  },isRead : {
    type : Boolean,
    default : false
  }
});
