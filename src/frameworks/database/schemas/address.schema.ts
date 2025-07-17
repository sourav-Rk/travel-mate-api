import mongoose from "mongoose";
import { IAddressModel } from "../models/address.model";

export const addressSchema = new mongoose.Schema<IAddressModel>(
  {
    userId :{
      type : mongoose.Schema.Types.ObjectId,
      ref : "vendors",
      required : true
    },
    street: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
