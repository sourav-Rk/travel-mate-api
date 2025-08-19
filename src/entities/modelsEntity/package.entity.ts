import { ObjectId } from "mongoose";

export interface IPackageEntity {
  _id?: ObjectId;
  agencyId: ObjectId;
  packageName: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  tags: string[];
  status: string;
  meetingPoint: string;
  images: string[];
  maxGroupSize: number;
  price: number;
  cancellationPolicy: string;
  termsAndConditions: string;
  inclusions: string[];
  exclusions: string[];
  startDate: Date;
  endDate: Date;
  duration: {
    nights: number;
    days: number;
  };
  itineraryId?: ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}
