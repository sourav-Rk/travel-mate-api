import mongoose from "mongoose";

import { POST_CATEGORY, POST_STATUS } from "../../../shared/constants";
import { IVolunteerPostModel } from "../models/volunteer-post.model";

export const volunteerPostSchema = new mongoose.Schema<IVolunteerPostModel>(
  {
    localGuideProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "local_guide_profiles",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 200,
      index: "text",
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 500,
      index: "text",
    },
    content: {
      type: String,
      required: true,
      trim: true,
      minlength: 50,
      maxlength: 10000,
      index: "text",
    },
    category: {
      type: String,
      enum: Object.values(POST_CATEGORY),
      required: true,
      index: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
        validate: {
          validator: function (coords: number[]) {
            return (
              coords.length === 2 &&
              coords[0] >= -180 &&
              coords[0] <= 180 && // longitude
              coords[1] >= -90 &&
              coords[1] <= 90
            ); // latitude
          },
          message: "Invalid coordinates format. Must be [longitude, latitude]",
        },
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
    },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: function (images: string[]) {
          return images.length <= 10;
        },
        message: "Maximum 10 images allowed per post",
      },
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: function (tags: string[]) {
          return tags.length <= 20;
        },
        message: "Maximum 20 tags allowed per post",
      },
    },
    offersGuideService: {
      type: Boolean,
      required: true,
      default: false,
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(POST_STATUS),
      default: POST_STATUS.DRAFT,
      required: true,
      index: true,
    },
    views: {
      type: Number,
      default: 0,
      min: 0,
    },
    likes: {
      type: Number,
      default: 0,
      min: 0,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Geospatial index for location-based queries
 */
volunteerPostSchema.index({ "location.coordinates": "2dsphere" });

/**
 * Compound indexes for common queries
 */
volunteerPostSchema.index({ status: 1, category: 1, createdAt: -1 });
volunteerPostSchema.index({ localGuideProfileId: 1, status: 1 });
volunteerPostSchema.index({ offersGuideService: 1, status: 1 });

/**
 * Text index for full-text search
 */
volunteerPostSchema.index({
  title: "text",
  description: "text",
  content: "text",
  tags: "text",
});
