import { ObjectId } from "mongoose";

//package basic details dto
export interface PackageBasicDetailsDto {
  agencyId: ObjectId;
  packageName: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  tags: string[];
  meetingPoint: string;
  images: string[];
  maxGroupSize: number;
  price: number;
  cancellationPolicy: string;
  termsAndConditions: string;
  startDate: string;
  endDate: string;
  duration: {
    days: number;
    nights: number;
  };
  inclusions: string[];
  exclusions: string[];
  status?: string;
  itineraryId ?: string;
}

//package itinerary dto
export type ItineraryDto = DayDto[];

//package activity dto
export interface ActivityDto {
  _id ?: string;
  name: string;
  dayNumber: number;
  description: string;
  duration: string;
  category: string;
  priceIncluded: boolean;
}

//day dto
export interface DayDto {
  dayNumber: number;
  title: string;
  description: string;
  accommodation: string;
  transfers: string[];
  meals: MealsDto;
  activities: ActivityDto[];
}

//meals dto
export interface MealsDto {
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
}



import { Types } from "mongoose";

export interface IDuration {
  _id: Types.ObjectId;
  days: number;
  nights: number;
}

export interface IActivity {
  _id: Types.ObjectId;
  name: string;       
  description?: string;
  [key: string]: any;  
}

export interface IDay extends DayDto {       
  activityDetails?: IActivity[];       
}

export interface IItinerary {
  packageId: Types.ObjectId;
  days: IDay[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IPackage {
  agencyId: Types.ObjectId;
  packageName: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  tags: string[];
  status: "active" | "inactive" | string;
  meetingPoint: string;
  images: string[];
  maxGroupSize: number;
  price: number;
  cancellationPolicy: string;
  termsAndConditions: string;
  startDate: Date;
  endDate: Date;
  duration: IDuration;
  exclusions: string[];
  inclusions: string[];
  createdAt: Date;
  updatedAt: Date;
  itineraryId: Types.ObjectId;
  itineraryDetails?: IItinerary;  
}
