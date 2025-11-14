import { TPostCategory, TPostStatus } from "../../shared/constants";
import { ILocation } from "./local-guide-profile.entity";


export interface IVolunteerPostEntity {
  _id?: string;
  localGuideProfileId: string;
  title: string;
  description: string;
  content: string;
  category: TPostCategory;
  location: ILocation;
  images: string[];
  tags: string[];
  offersGuideService: boolean;
  status: TPostStatus;
  views: number;
  likes: number;
  publishedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

