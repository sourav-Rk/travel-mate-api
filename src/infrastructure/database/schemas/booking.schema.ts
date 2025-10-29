import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

import { BOOKINGSTATUS } from "../../../shared/constants";
import { IBookingModel } from "../models/booking.model";

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

const cancellationRequestFields = {
  requestedAt: { type: Date },
  reason: { type: String },
  calculatedRefund: { type: Number },
  approvedAt: { type: Date },
};

const advancePaymentSchema = new mongoose.Schema(paymentFields, { _id: false });

const fullPaymentSchema = new mongoose.Schema(paymentFields, { _id: false });

const cancellationRequestSchema = new mongoose.Schema(
  cancellationRequestFields,
  { _id: false }
);

export const bookingSchema = new mongoose.Schema<IBookingModel>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "clients",
      required: true,
      index: true,
    },
    bookingId: {
      type: String,
      unique: true,
      default: function () {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        // Take only first 6 chars of UUID for brevity
        const uniqueId = uuidv4()
          .replace(/-/g, "")
          .substring(0, 6)
          .toUpperCase();

        return `TRAVELMATE-${year}${month}${day}-${uniqueId}`;
      },
    },
    packageId: {
      type: String,
      ref: "packages",
      required: true,
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
    refundAmount: {
      type: Number,
    },
    cancellationRequest: cancellationRequestSchema,
  },
  {
    timestamps: true,
  }
);

bookingSchema.index({ userId: 1, packageId: 1 }, { unique: true });

bookingSchema.index({ packageId: 1, status: 1 });
