import mongoose from "mongoose";
import { IClientModel } from "../models/client.model";
import { GENDER, ROLES } from "../../../shared/constants";

export const clientSchema = new mongoose.Schema<IClientModel>(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique : true
    },
    phone : {
      type : String,
      required : true,
      unique : true
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum : Object.values(GENDER),
      required : true
    },
    role :{
      type : String,
      enum : ROLES,
      required : true
    },
    googleId : {
      type : String,
      default : null,
    },
    bio : {
      type : String,
      default : null,
    },
    profileImage :{
      type : String,
      default : null
    },
    isBlocked :{
      type : Boolean,
      default : false
    },
  },
  {
    timestamps: true,
  }
);
