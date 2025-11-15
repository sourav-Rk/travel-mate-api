import mongoose, { Document } from "mongoose";

import { IWishlistEntity } from "../../../domain/entities/wishlist.entity";
import { wishlistSchema } from "../schemas/wishlist.schema";

export interface IWishlistModel
  extends Omit<IWishlistEntity, "_id" | "userId">,
    Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
}

export const wishlistDB = mongoose.model("wishlist", wishlistSchema);
