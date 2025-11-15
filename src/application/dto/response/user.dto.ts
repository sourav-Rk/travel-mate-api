import { TRole } from "../../../shared/constants";

//base user DTO
export interface BaseUserDto {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  phone: string;
  profileImage: string;
  googleId?: string;
}

//Client DTO
export interface ClientDto {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password?: string;
  gender?: string;
  profileImage?: string;
  googleId?: string;
  isBlocked?: boolean;
  role: "client";
}

//Vendor DTO
export interface VendorDto {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password?: string;
  role: "vendor";
  agencyName: string;
  description?: string;
  profileImage?: string;
  isBlocked?: boolean;
  status?: string;
}

//Guide DTO
export interface GuideDto {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  dob: string;
  yearOfExperience: string;
  languageSpoken: string[];
  alternatePhone?: string;
  password?: string;
  role: "guide";
  documents: string[];
  bio?: string;
  profileImage?: string;
  isAvailable: boolean;
}

export type UserDto = ClientDto | VendorDto | GuideDto;

export interface LoginUserDTO {
  email: string;
  password?: string;
  role: TRole;
}

//client details for vendor
export interface ClientDetailsForVendorDto {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profileImage?: string;
}
