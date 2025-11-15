import { Schema } from "mongoose";

import { INSTRUCTION_PRIORITY } from "../../../shared/constants";
import { IGuideInstructionModel } from "../models/guide-instruction.model";

const priorityValues: INSTRUCTION_PRIORITY[] = [
  "LOW",
  "MEDIUM",
  "HIGH",
  "URGENT",
];

export const guideInstructionSchema = new Schema<IGuideInstructionModel>(
  {
    guideId: {
      type: Schema.Types.ObjectId,
      ref: "guides",
      required: true,
    },
    packageId: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    type: {
      type: String,
      required: true,
      enum: [
        "MEETING_POINT",
        "ITINERARY_UPDATE",
        "SAFETY_INFO",
        "REMINDER",
        "GENERAL",
      ],
    },
    priority: {
      type: String,
      enum: priorityValues,
      default: "MEDIUM",
    },
    location: {
      name: String,
      address: String,
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },

    sentAt: {
      type: Date,
    },
    readBy: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);
