import mongoose from "mongoose";

import { BadgeCategory, BadgeCriteriaType } from "../../../domain/entities/badge.entity";
import { IBadgeModel } from "../models/badge.model";

const badgeCriteriaSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: Object.values(BadgeCriteriaType),
      required: true,
    },
    value: {
      type: Number,
      required: true,
      min: 0,
    },
    additionalCondition: {
      type: {
        type: String,
        enum: Object.values(BadgeCriteriaType),
      },
      value: {
        type: Number,
        min: 0,
      },
      _id: false,
    }
  },
  { _id: false }
);

export const badgeSchema = new mongoose.Schema<IBadgeModel>(
  {
    badgeId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
      lowercase: true,
      match: /^[a-z0-9_-]+$/, // Only lowercase letters, numbers, underscores, and hyphens
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    category: {
      type: String,
      enum: Object.values(BadgeCategory),
      required: true,
      index: true,
    },
    icon: {
      type: String,
      default: null,
      trim: true,
      maxlength: 10, // For emoji or short icon identifiers
    },
    criteria: {
      type: [badgeCriteriaSchema],
      required: true,
      validate: {
        validator: function (criteria: Array<{ type: string; value: number }>) {
          return criteria && criteria.length > 0;
        },
        message: "At least one criterion is required",
      },
    },
    priority: {
      type: Number,
      default: 0,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admins",
      default: null,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admins",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);


badgeSchema.index({ isActive: 1, category: 1 });
badgeSchema.index({ badgeId: 1, isActive: 1 });

