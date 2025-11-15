
import {  TRole } from "../../shared/constants";

export interface IUserEntity {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password : string;
  phone?: string;
  role: TRole;
  gender?: string;
  status ?: string;
  profileImage?: string;
  googleId?: string;
  isBlocked?: boolean;
  createdAt: Date;
  updatedAt: Date;
}


