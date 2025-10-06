import { ObjectId } from "mongoose";

import { TRole } from "../../../shared/constants";

export type SignupRequestDto = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  gender?: string;
  profileImage?: string;
  isBlocked?: boolean;
};

export type LoginResponseDto = {
  id: ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  role: TRole;
  accessToken: string;
  refreshToken: string;
};

export interface AddressDto {
  vendorId: string;
  street: string;
  city: string;
  address: string;
  state: string;
  pincode: string;
  country: string;
}

export interface KycDto {
  pan?: string;
  gstin?: string;
  documents?: string[];
}
