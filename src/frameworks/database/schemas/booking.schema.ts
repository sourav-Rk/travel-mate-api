import mongoose from "mongoose";
import { IBookingModel } from "../models/booking.model";
import { BOOKINGSTATUS } from "../../../shared/constants";

const paymentFields = {
  amount: {
    type: Number,
    default: 0,
  },
  paid: {
    type: Boolean,
    default: false,
  },
  dueDate: {
    type: Date,
    default: null,
  },
  paidAt: {
    type: Date,
    default: null,
  },
};

const advancePaymentSchema = new mongoose.Schema(paymentFields, { _id: false });

const fullPaymentSchema = new mongoose.Schema(paymentFields, { _id: false });

export const bookingSchema = new mongoose.Schema<IBookingModel>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "clients",
    required: true,
    index: true,
  },
  packageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "packages",
    required: true,
    index: true,
  },
  status: {
    type: String,
    enum: Object.values(BOOKINGSTATUS),
    index: true,
  },
  advancePayment: advancePaymentSchema,
  fullPayment: fullPaymentSchema,
  isWaitlisted: {
    type: Boolean,
    default: false,
  },
  cancelledAt: {
    type: Date,
  },
},{
  timestamps : true
});

bookingSchema.index({ userId: 1, packageId: 1 }, { unique: true });

bookingSchema.index({ packageId: 1, status: 1 });
