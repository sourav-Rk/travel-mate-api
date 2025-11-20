import mongoose, { Document, Types } from "mongoose";

import { ILocalGuideBookingEntity } from "../../../domain/entities/local-guide-booking.entity";
import { localGuideBookingSchema } from "../schemas/local-guide-booking.schema";

export interface ILocalGuideBookingModel
  extends Omit<
      ILocalGuideBookingEntity,
      "_id" | "travellerId" | "guideId" | "guideProfileId" | "guideChatRoomId"
    >,
    Document {
  _id: Types.ObjectId;
  travellerId: Types.ObjectId;
  guideId: Types.ObjectId;
  guideProfileId: Types.ObjectId;
  guideChatRoomId: Types.ObjectId;
}

export const localGuideBookingDB = mongoose.model<ILocalGuideBookingModel>(
  "local_guide_bookings",
  localGuideBookingSchema
);







