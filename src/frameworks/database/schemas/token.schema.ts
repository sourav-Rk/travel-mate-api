import { Schema } from "mongoose";
import { ITokenModel } from "../models/token.model";

export const tokenSchema = new Schema<ITokenModel>(
  {
    token: {
      type: String,
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    expiry: {
      type: Date,
      required: true,
      index: { expires: 1 },
    },
  },
  { timestamps: true }
);
