import mongoose from "mongoose";
import { INotificationModel } from "../models/notification.model";
import { ROLES } from "../../../shared/constants";

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
