import { FilterQuery, PipelineStage } from "mongoose";
import { injectable } from "tsyringe";

import { VolunteerPostMapper } from "../../../application/mapper/volunteer-post.mapper";
import { IVolunteerPostEntity } from "../../../domain/entities/volunteer-post.entity";
import {
  ILocationQuery,
  IPaginationOptions,
  IPostFilters,
  IVolunteerPostRepository,
} from "../../../domain/repositoryInterfaces/volunteer-post/volunteer-post-repository.interface";
import {
  IVolunteerPostModel,
  volunteerPostDB,
} from "../../database/models/volunteer-post.model";
import { BaseRepository } from "../baseRepository";

@injectable()
export class VolunteerPostRepository
  extends BaseRepository<IVolunteerPostModel, IVolunteerPostEntity>
  implements IVolunteerPostRepository
{
  constructor() {
    super(volunteerPostDB, VolunteerPostMapper.toEntity);
  }

  private buildFilterQuery(filters?: IPostFilters): FilterQuery<IVolunteerPostModel> {
    const query: FilterQuery<IVolunteerPostModel> = {};

    if (filters?.status) {
      query.status = filters.status;
    }

    if (filters?.category) {
      query.category = filters.category;
    }

    if (filters?.localGuideProfileId) {
      query.localGuideProfileId = filters.localGuideProfileId;
    }

    if (filters?.offersGuideService !== undefined) {
      query.offersGuideService = filters.offersGuideService;
    }

    if (filters?.minViews !== undefined) {
      query.views = { $gte: filters.minViews };
    }

    if (filters?.tags && filters.tags.length > 0) {
      query.tags = { $in: filters.tags };
    }

    return query;
  }

  private buildSortStage(
    sortBy?: "newest" | "oldest" | "views" | "likes"
  ): Record<string, 1 | -1> {
    switch (sortBy) {
      case "oldest":
        return { createdAt: 1 };
      case "views":
        return { views: -1 };
      case "likes":
        return { likes: -1 };
      case "newest":
      default:
        return { createdAt: -1 };
    }
  }

  async findByLocalGuideProfileId(
    profileId: string,
    filters?: IPostFilters,
    pagination?: IPaginationOptions
  ): Promise<{
    posts: IVolunteerPostEntity[];
    total: number;
    currentPage: number;
    totalPages: number;
  }> {
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const skip = (page - 1) * limit;

    const query: FilterQuery<IVolunteerPostModel> = {
      localGuideProfileId: profileId,
      ...this.buildFilterQuery(filters),
    };

    const [posts, total] = await Promise.all([
      volunteerPostDB
        .find(query)
        .sort(this.buildSortStage(pagination?.sortBy))
        .skip(skip)
        .limit(limit)
        .exec(),
      volunteerPostDB.countDocuments(query).exec(),
    ]);

    return {
      posts: posts.map((post) => VolunteerPostMapper.toEntity(post)),
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findByLocation(
    locationQuery: ILocationQuery,
    filters?: IPostFilters,
    pagination?: IPaginationOptions
  ): Promise<{
    posts: Array<IVolunteerPostEntity & { distance?: number }>;
    total: number;
    currentPage: number;
    totalPages: number;
  }> {
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const skip = (page - 1) * limit;

    const baseQuery = this.buildFilterQuery(filters);
    if (!baseQuery.status) {
      baseQuery.status = "published";
    }

    const pipeline: PipelineStage[] = [
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [locationQuery.longitude, locationQuery.latitude],
          },
          distanceField: "distance",
          maxDistance: locationQuery.radiusInMeters,
          query: baseQuery,
          spherical: true,
        },
      },
      {
        $facet: {
          posts: [
            { $sort: this.buildSortStage(pagination?.sortBy) },
            { $skip: skip },
            { $limit: limit },
          ],
          total: [{ $count: "count" }],
        },
      },
    ];

    const result = await volunteerPostDB
      .aggregate<{
        posts: Array<IVolunteerPostModel & { distance?: number }>;
        total: Array<{ count: number }>;
      }>(pipeline)
      .exec();

    const posts = result[0]?.posts || [];
    const total = result[0]?.total[0]?.count || 0;

    return {
      posts: posts.map((post) => ({
        ...VolunteerPostMapper.toEntity(post),
        distance: post.distance,
      })),
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findByBoundingBox(
    boundingBox: {
      north: number;
      south: number;
      east: number;
      west: number;
    },
    centerPoint: { longitude: number; latitude: number },
    filters?: IPostFilters,
    pagination?: IPaginationOptions
  ): Promise<{
    posts: Array<IVolunteerPostEntity & { distance?: number }>;
    total: number;
    currentPage: number;
    totalPages: number;
  }> {
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const skip = (page - 1) * limit;

    const baseQuery = this.buildFilterQuery(filters);
    if (!baseQuery.status) {
      baseQuery.status = "published";
    }

    baseQuery["location.coordinates"] = {
      $geoWithin: {
        $box: [
          [boundingBox.west, boundingBox.south],
          [boundingBox.east, boundingBox.north],
        ],
      },
    };

    const pipeline: PipelineStage[] = [
      {
        $match: baseQuery,
      },
      {
        $addFields: {
          coordLongitude: { $arrayElemAt: ["$location.coordinates", 0] },
          coordLatitude: { $arrayElemAt: ["$location.coordinates", 1] },
        },
      },
      {
        $addFields: {
          distance: {
            $multiply: [
              6371000, // Earth radius in meters
              {
                $acos: {
                  $add: [
                    {
                      $multiply: [
                        { $sin: { $degreesToRadians: "$coordLatitude" } },
                        { $sin: { $degreesToRadians: centerPoint.latitude } },
                      ],
                    },
                    {
                      $multiply: [
                        { $cos: { $degreesToRadians: "$coordLatitude" } },
                        { $cos: { $degreesToRadians: centerPoint.latitude } },
                        {
                          $cos: {
                            $degreesToRadians: {
                              $subtract: ["$coordLongitude", centerPoint.longitude],
                            },
                          },
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
        },
      },
      {
        $facet: {
          posts: [
            { $sort: this.buildSortStage(pagination?.sortBy) },
            { $skip: skip },
            { $limit: limit },
          ],
          total: [{ $count: "count" }],
        },
      },
    ];

    const result = await volunteerPostDB
      .aggregate<{
        posts: Array<IVolunteerPostModel & { distance?: number }>;
        total: Array<{ count: number }>;
      }>(pipeline)
      .exec();

    const posts = result[0]?.posts || [];
    const total = result[0]?.total[0]?.count || 0;

    return {
      posts: posts.map((post) => ({
        ...VolunteerPostMapper.toEntity(post),
        distance: post.distance,
      })),
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findByCategory(
    category: string,
    filters?: IPostFilters,
    pagination?: IPaginationOptions
  ): Promise<{
    posts: IVolunteerPostEntity[];
    total: number;
    currentPage: number;
    totalPages: number;
  }> {
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const skip = (page - 1) * limit;

    const query: FilterQuery<IVolunteerPostModel> = {
      category,
      ...this.buildFilterQuery(filters),
    };

    const [posts, total] = await Promise.all([
      volunteerPostDB
        .find(query)
        .sort(this.buildSortStage(pagination?.sortBy))
        .skip(skip)
        .limit(limit)
        .exec(),
      volunteerPostDB.countDocuments(query).exec(),
    ]);

    return {
      posts: posts.map((post) => VolunteerPostMapper.toEntity(post)),
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async search(
    searchTerm: string,
    filters?: IPostFilters,
    pagination?: IPaginationOptions
  ): Promise<{
    posts: IVolunteerPostEntity[];
    total: number;
    currentPage: number;
    totalPages: number;
  }> {
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const skip = (page - 1) * limit;

    const baseQuery = this.buildFilterQuery(filters);
    if (!baseQuery.status) {
      baseQuery.status = "published";
    }

    const query: FilterQuery<IVolunteerPostModel> = {
      ...baseQuery,
      $text: { $search: searchTerm },
    };

    const [posts, total] = await Promise.all([
      volunteerPostDB
        .find(query, { score: { $meta: "textScore" } })
        .sort({ score: { $meta: "textScore" }, ...this.buildSortStage(pagination?.sortBy) })
        .skip(skip)
        .limit(limit)
        .exec(),
      volunteerPostDB.countDocuments(query).exec(),
    ]);

    return {
      posts: posts.map((post) => VolunteerPostMapper.toEntity(post)),
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findPublished(
    filters?: IPostFilters,
    pagination?: IPaginationOptions
  ): Promise<{
    posts: IVolunteerPostEntity[];
    total: number;
    currentPage: number;
    totalPages: number;
  }> {
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const skip = (page - 1) * limit;
    
    const query: FilterQuery<IVolunteerPostModel> = {
      status: "published",
      ...this.buildFilterQuery(filters),
    };

    const [posts, total] = await Promise.all([
      volunteerPostDB
        .find(query)
        .sort(this.buildSortStage(pagination?.sortBy))
        .skip(skip)
        .limit(limit)
        .exec(),
      volunteerPostDB.countDocuments(query).exec(),
    ]);

    
    return {
      posts: posts.map((post) => VolunteerPostMapper.toEntity(post)),
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async incrementViews(postId: string): Promise<IVolunteerPostEntity | null> {
    const post = await volunteerPostDB
      .findByIdAndUpdate(
        postId,
        { $inc: { views: 1 } },
        { new: true }
      )
      .exec();

    if (!post) return null;
    return VolunteerPostMapper.toEntity(post);
  }

  async updateStatus(
    postId: string,
    status: "draft" | "published" | "archived" | "hidden"
  ): Promise<IVolunteerPostEntity | null> {
    const updateData: FilterQuery<IVolunteerPostModel> = {
      status,
      updatedAt: new Date(),
    };

    if (status === "published") {
      updateData.publishedAt = new Date();
    }

    const post = await volunteerPostDB
      .findByIdAndUpdate(postId, updateData, { new: true })
      .exec();

    if (!post) return null;
    return VolunteerPostMapper.toEntity(post);
  }

  async incrementLikes(postId: string): Promise<IVolunteerPostEntity | null> {
    const post = await volunteerPostDB
      .findByIdAndUpdate(
        postId,
        { $inc: { likes: 1 } },
        { new: true }
      )
      .exec();

    if (!post) return null;
    return VolunteerPostMapper.toEntity(post);
  }

  async decrementLikes(postId: string): Promise<IVolunteerPostEntity | null> {
    const post = await volunteerPostDB
      .findByIdAndUpdate(
        postId,
        { $inc: { likes: -1 } },
        { new: true }
      )
      .exec();

    if (!post) return null;
    return VolunteerPostMapper.toEntity(post);
  }

  async aggregateLikesAndViews(
    guideProfileId: string
  ): Promise<{
    totalLikes: number;
    totalViews: number;
    maxPostLikes: number;
    maxPostViews: number;
  }> {
    const pipeline: PipelineStage[] = [
      {
        $match: {
          localGuideProfileId: guideProfileId,
        },
      },
      {
        $group: {
          _id: null,
          totalLikes: { $sum: "$likes" },
          totalViews: { $sum: "$views" },
          maxPostLikes: { $max: "$likes" },
          maxPostViews: { $max: "$views" },
        },
      },
    ];

    const result = await volunteerPostDB
      .aggregate<{
        totalLikes: number;
        totalViews: number;
        maxPostLikes: number;
        maxPostViews: number;
      }>(pipeline)
      .exec();

    const aggregated = result[0] || {
      totalLikes: 0,
      totalViews: 0,
      maxPostLikes: 0,
      maxPostViews: 0,
    };

    return {
      totalLikes: aggregated.totalLikes || 0,
      totalViews: aggregated.totalViews || 0,
      maxPostLikes: aggregated.maxPostLikes || 0,
      maxPostViews: aggregated.maxPostViews || 0,
    };
  }
}

