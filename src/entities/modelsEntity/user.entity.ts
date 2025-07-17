import { ObjectId } from "mongoose";
import {  TRole, TStatus } from "../../shared/constants";

export interface IUserEntity {
  _id: ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  role: TRole;
  gender?: string;
  status ?: string;
  profileImage?: string;
  googleId?: string;
  isBlocked?: boolean;
  createdAt: Date;
  updatedAt: Date;
}


