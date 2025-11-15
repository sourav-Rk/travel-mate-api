import { IVolunteerPostEntity } from "../../entities/volunteer-post.entity";
import { IBaseRepository } from "../baseRepository.interface";

export interface IPostFilters {
  status?: "draft" | "published" | "archived" | "hidden";
  category?: string;
  localGuideProfileId?: string;
  offersGuideService?: boolean;
  minViews?: number;
  tags?: string[];
}

export interface IPaginationOptions {
  page: number;
  limit: number;
  sortBy?: "newest" | "oldest" | "views" | "likes";
}

export interface ILocationQuery {
  longitude: number;
  latitude: number;
  radiusInMeters: number;
}

export interface IVolunteerPostRepository
  extends IBaseRepository<IVolunteerPostEntity> {
  findByLocalGuideProfileId(
    profileId: string,
    filters?: IPostFilters,
    pagination?: IPaginationOptions
  ): Promise<{
    posts: IVolunteerPostEntity[];
    total: number;
    currentPage: number;
    totalPages: number;
  }>;

  findByLocation(
    locationQuery: ILocationQuery,
    filters?: IPostFilters,
    pagination?: IPaginationOptions
  ): Promise<{
    posts: Array<IVolunteerPostEntity & { distance?: number }>;
    total: number;
    currentPage: number;
    totalPages: number;
  }>;

  findByCategory(
    category: string,
    filters?: IPostFilters,
    pagination?: IPaginationOptions
  ): Promise<{
    posts: IVolunteerPostEntity[];
    total: number;
    currentPage: number;
    totalPages: number;
  }>;

  search(
    searchTerm: string,
    filters?: IPostFilters,
    pagination?: IPaginationOptions
  ): Promise<{
    posts: IVolunteerPostEntity[];
    total: number;
    currentPage: number;
    totalPages: number;
  }>;

  findPublished(
    filters?: IPostFilters,
    pagination?: IPaginationOptions
  ): Promise<{
    posts: IVolunteerPostEntity[];
    total: number;
    currentPage: number;
    totalPages: number;
  }>;

  incrementViews(postId: string): Promise<IVolunteerPostEntity | null>;

  updateStatus(
    postId: string,
    status: "draft" | "published" | "archived" | "hidden"
  ): Promise<IVolunteerPostEntity | null>;

  incrementLikes(postId: string): Promise<IVolunteerPostEntity | null>;

  decrementLikes(postId: string): Promise<IVolunteerPostEntity | null>;
}

