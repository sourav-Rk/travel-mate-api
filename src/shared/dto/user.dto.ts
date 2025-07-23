import { TRole } from "../constants";

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
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password?: string;
  gender?: string;
  profileImage?: string;
  googleId?: string;
  role: "client";
}

//Vendor DTO
export interface VendorDto {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: "vendor";
  agencyName: string;
  description?: string;
  profileImage?: string;
}

//Guide DTO
export interface GuideDto {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  dob: string;
  yearOfExperience: string;
  languageSpoken: string[];
  alternatePhone?: string;
  password: string;
  role: "guide";
  documents: string[];
  bio?: string;
  profileImage?: string;
}

export type UserDto = ClientDto | VendorDto | GuideDto;

export interface LoginUserDTO {
  email: string;
  password?: string;
  role: TRole;
}
