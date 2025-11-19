import mongoose from "mongoose";

import { GUIDE_SPECIALTIES, VERIFICATION_STATUS } from "../../../shared/constants";
import { ILocalGuideProfileModel } from "../models/local-guide-profile.model";

export const localGuideProfileSchema = new mongoose.Schema<ILocalGuideProfileModel>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "clients",
      required: true,
      unique: true,
      index: true,
    },
    verificationStatus: {
      type: String,
      enum: Object.values(VERIFICATION_STATUS),
      default: VERIFICATION_STATUS.PENDING,
      required: true,
      index: true,
    },
    verificationRequestedAt: {
      type: Date,
      default: Date.now,
    },
    verifiedAt: {
      type: Date,
      default: null,
    },
    rejectedAt: {
      type: Date,
      default: null,
    },
    rejectionReason: {
      type: String,
      default: null,
    },
    verificationDocuments: {
      idProof: {
        type: String,
        default: null,
      },
      addressProof: {
        type: String,
        default: null,
      },
      additionalDocuments: {
        type: [String],
        default: [],
      },
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
      address: {
        type: String,
        default: null,
      },
      formattedAddress: {
        type: String,
        default: null,
      },
    },
    hourlyRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 10000,
    },
    languages: {
      type: [String],
      default: [],
    },
    specialties: {
      type: [String],
      enum: Object.values(GUIDE_SPECIALTIES),
      default: [],
    },
    bio: {
      type: String,
      default: null,
      maxlength: 1000,
    },
    profileImage: {
      type: String,
      default: null,
    },
    isAvailable: {
      type: Boolean,
      default: true,
      index: true,
    },
    availabilityNote: {
      type: String,
      default: null,
    },
    stats: {
      totalSessions: {
        type: Number,
        default: 0,
      },
      completedSessions: {
        type: Number,
        default: 0,
      },
      averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      totalRatings: {
        type: Number,
        default: 0,
      },
      totalPosts: {
        type: Number,
        default: 0,
      },
      totalEarnings: {
        type: Number,
        default: 0,
      },
      totalLikes: {
        type: Number,
        default: 0,
      },
      totalViews: {
        type: Number,
        default: 0,
      },
      maxPostLikes: {
        type: Number,
        default: 0,
      },
      maxPostViews: {
        type: Number,
        default: 0,
      },
      completionRate: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
    },
    badges: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

localGuideProfileSchema.index({ "location.coordinates": "2dsphere" });


localGuideProfileSchema.index({
  "location.coordinates": "2dsphere",
  isAvailable: 1,
  verificationStatus: 1,
});

