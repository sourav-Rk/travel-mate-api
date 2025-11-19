import { Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

import { ILocalGuideBookingModel } from "../models/local-guide-booking.model";

const advancePaymentSchema = new Schema(
  {
    amount: { type: Number, required: true },
    paid: { type: Boolean, default: false },
    dueDate: { type: Date, required: true },
    paidAt: { type: Date, default: null },
  },
  { _id: false }
);

const fullPaymentSchema = new Schema(
  {
    amount: { type: Number, required: true },
    paid: { type: Boolean, default: false },
    dueDate: { type: Date, default: null },
    paidAt: { type: Date, default: null },
  },
  { _id: false }
);

const locationSchema = new Schema(
  {
    address: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    latitude: { type: Number },
    longitude: { type: Number },
  },
  { _id: false }
);

const cancellationRequestSchema = new Schema(
  {
    requestedAt: { type: Date, required: true },
    reason: { type: String, required: true },
    calculatedRefund: { type: Number },
    approvedAt: { type: Date },
  },
  { _id: false }
);

export const localGuideBookingSchema = new Schema<ILocalGuideBookingModel>(
  {
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

        return `LG-${year}${month}${day}-${uniqueId}`;
      },
    },
    travellerId: {
      type: Schema.Types.ObjectId,
      ref: "clients",
      required: true,
      index: true,
    },
    guideId: {
      type: Schema.Types.ObjectId,
      ref: "clients",
      required: true,
      index: true,
    },
    guideProfileId: {
      type: Schema.Types.ObjectId,
      ref: "local_guide_profiles",
      required: true,
      index: true,
    },
    quoteId: {
      type: String,
      required: true,
      index: true,
    },
    guideChatRoomId: {
      type: Schema.Types.ObjectId,
      ref: "guide_chat_rooms",
      required: true,
      index: true,
    },
    sessionDate: {
      type: Date,
      required: true,
    },
    sessionTime: {
      type: String,
      required: true, // HH:mm format
    },
    hours: {
      type: Number,
      required: true,
      min: 0.5,
    },
    hourlyRate: {
      type: Number,
      required: true,
      min: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    location: locationSchema,
    notes: {
      type: String,
    },
    status: {
      type: String,
      enum: [
        "QUOTE_ACCEPTED",
        "ADVANCE_PENDING",
        "CONFIRMED",
        "IN_PROGRESS",
        "COMPLETED",
        "FULLY_PAID",
        "CANCELLED",
      ],
      default: "QUOTE_ACCEPTED",
      index: true,
    },
    advancePayment: {
      type: advancePaymentSchema,
      required: true,
    },
    fullPayment: {
      type: fullPaymentSchema,
      required: true,
    },
    serviceCompletedAt: {
      type: Date,
    },
    completionNotes: {
      type: String,
    },
    completionRating: {
      type: Number,
      min: 1,
      max: 5,
    },
    cancelledAt: {
      type: Date,
    },
    cancellationRequest: cancellationRequestSchema,
  },
  { timestamps: true }
);

// Indexes
localGuideBookingSchema.index({ bookingId: 1 }, { unique: true });
localGuideBookingSchema.index({ travellerId: 1, status: 1 });
localGuideBookingSchema.index({ guideId: 1, status: 1 });
localGuideBookingSchema.index({ guideProfileId: 1 });
localGuideBookingSchema.index({ quoteId: 1 }, { unique: true });
localGuideBookingSchema.index({ guideChatRoomId: 1 });
localGuideBookingSchema.index(
  { guideId: 1, sessionDate: 1, sessionTime: 1 },
  { name: "conflict_check_index" }
);



