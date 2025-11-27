import mongoose, { UpdateQuery } from "mongoose";
import { v4 as uuidv4 } from "uuid";

import { IPackageModel } from "../models/package.model";
import { IPackageEntity } from "../../../domain/entities/package.entity";

const durationSchema = new mongoose.Schema({
  days: {
    type: Number,
  },
  nights: {
    type: Number,
  },
});

export const packageSchema = new mongoose.Schema<IPackageModel>(
  {
    packageId: {
      type: String,
      unique: true,
      index: true,
    },
    agencyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "vendors",
      required: true,
    },
    packageName: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
    },
    status: {
      type: String,
      default: "draft",
    },
    meetingPoint: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      required: true,
    },
    maxGroupSize: {
      type: Number,
      required: true,
    },
    minGroupSize: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    cancellationPolicy: {
      type: String,
      required: true,
    },
    termsAndConditions: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    duration: {
      type: durationSchema,
    },
    itineraryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "itinerarys",
    },
    exclusions: {
      type: [String],
    },
    inclusions: {
      type: [String],
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    applicationDeadline: {
      type: Date,
    },
    advancePaymentDeadlineDays: {
      type: Number,
      default: 5,
    },
    fullPaymentDeadlineDays: {
      type: Number,
      default: 7,
    },
    paymentAlertSentAt: {
      type: Date,
    },
    guideId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "guides",
    },
  },
  {
    timestamps: true,
  }
);

packageSchema.pre("save", function (next) {
  if (!this.packageId) {
    const date = new Date(this.createdAt || new Date());
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    const uniqueId = uuidv4().replace(/-/g, "").substring(0, 6).toUpperCase();
    this.packageId = `PKG-${year}${month}${day}-${uniqueId}`;
  }

  if (this.startDate && !this.applicationDeadline) {
    const deadline = new Date(this.startDate);
    deadline.setDate(deadline.getDate() - 15);
    this.applicationDeadline = deadline;
  }
  next();
});

packageSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate() as UpdateQuery<IPackageEntity> | undefined;

  if (!update) return next();

  const updateDoc = update.$set ? update.$set : update;
  /**
   *Update applicationDeadline only if startDate changes
   */
  if (updateDoc.startDate) {
    const deadline = new Date(updateDoc.startDate);
    deadline.setDate(deadline.getDate() - 15);
    updateDoc.applicationDeadline = deadline;
  }

  next();
});
