import { IVolunteerPostEntity } from "../../../domain/entities/volunteer-post.entity";
import { LocalGuideDetailsDto } from "./local-guide.dto";

export interface VolunteerPostDto {
  _id: string;
  localGuideProfileId: string;
  title: string;
  description: string;
  content: string;
  category: string;
  location: {
    type: "Point";
    coordinates: [number, number];
    city: string;
    state: string;
    country: string;
  };
  images: string[];
  tags: string[];
  offersGuideService: boolean;
  status: string;
  views: number;
  likes: number;
  isLiked?: boolean; // Whether the current user has liked this post
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  distance?: number;
}

export interface VolunteerPostListDto {
  posts: VolunteerPostListItemDto[];
  total: number;
  currentPage: number;
  totalPages: number;
}

export interface VolunteerPostDetailDto extends VolunteerPostDto {
  guideDetails: LocalGuideDetailsDto;
}

export interface VolunteerPostListItemDto {
  _id: string;
  localGuideProfileId: string;
  title: string;
  description: string;
  category: string;
  images: string[];
  offersGuideService: boolean;
  status: string;
  views: number;
  likes: number;
  isLiked?: boolean; // Whether the current user has liked this post
  publishedAt?: Date;
  location: {
    type: "Point";
    coordinates: [number, number];
    city: string;
    state: string;
    country: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
