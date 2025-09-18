import mongoose, { Document } from "mongoose";
import { IBookingEntity } from "../../../entities/modelsEntity/booking.entity";
import { bookingSchema } from "../schemas/booking.schema";

export interface IBookingModel extends Omit<IBookingEntity,"_id" | "userId">,Document{
    userId : mongoose.Types.ObjectId,
}

export const bookingDB = mongoose.model("bookings",bookingSchema)