import mongoose from "mongoose";

import { IWishlistModel } from "../models/wishlist.model";

export const wishlistSchema = new mongoose.Schema<IWishlistModel>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "clients",
    },
    packages: {
      type: [{ type: String, ref: "packages" }],
    },
  },
  {
    timestamps: true,
  }
);
