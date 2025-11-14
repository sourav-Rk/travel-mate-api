import { inject, injectable } from "tsyringe";

import { GetVolunteerPostsReqDTO } from "../../../../application/dto/request/volunteer-post.dto";
import { VolunteerPostListDto } from "../../../../application/dto/response/volunteer-post.dto";
import { IVolunteerPostRepository } from "../../../../domain/repositoryInterfaces/volunteer-post/volunteer-post-repository.interface";
import { IGetVolunteerPostsUsecase } from "../../interfaces/volunteer-post/get-volunteer-posts-usecase.interface";
import { VolunteerPostMapper } from "../../../mapper/volunteer-post.mapper";

@injectable()
export class GetVolunteerPostsUsecase implements IGetVolunteerPostsUsecase {
  constructor(
    @inject("IVolunteerPostRepository")
    private _volunteerPostRepository: IVolunteerPostRepository
  ) {}

  async execute(filters: GetVolunteerPostsReqDTO): Promise<VolunteerPostListDto> {
    const page = Number(filters.page) || 1;
    const limit = Number(filters?.limit) > 0 ? Number(filters.limit) : 10;


    console.log(filters)

    const postFilters = {
      status: filters.status,
      category: filters.category,
      localGuideProfileId: filters.localGuideProfileId,
      offersGuideService: filters.offersGuideService,
    };

    const pagination = {
      page,
      limit,
      sortBy: filters.sortBy,
    };

    /**
     *  If no status filter, get published posts by default
     */
    if (!filters.status && !filters.localGuideProfileId) {
      const result = await this._volunteerPostRepository.findPublished(
        postFilters,
        pagination
      );

      const mappedPosts = result.posts.map((post) => {
      return VolunteerPostMapper.mapToListItemDto(post);
    });
    

      return {
        posts:mappedPosts,
        total: result.total,
        currentPage: result.currentPage,
        totalPages: result.totalPages,
      };
    }

    /**
     * If localGuideProfileId is provided, get posts by profile
     */
    if (filters.localGuideProfileId) {
      const result =
        await this._volunteerPostRepository.findByLocalGuideProfileId(
          filters.localGuideProfileId,
          postFilters,
          pagination
        );

      return {
        posts: result.posts.map((post) => ({
          _id: post._id || "",
          localGuideProfileId: post.localGuideProfileId,
          title: post.title,
          description: post.description,
          content: post.content,
          category: post.category,
          location: post.location,
          images: post.images,
          tags: post.tags,
          offersGuideService: post.offersGuideService,
          status: post.status,
          views: post.views,
          likes: post.likes,
          publishedAt: post.publishedAt,
          createdAt: post.createdAt || new Date(),
          updatedAt: post.updatedAt || new Date(),
        })),
        total: result.total,
        currentPage: result.currentPage,
        totalPages: result.totalPages,
      };
    }

    // If category is provided, get posts by category
    if (filters.category) {
      const result = await this._volunteerPostRepository.findByCategory(
        filters.category,
        postFilters,
        pagination
      );

      return {
        posts: result.posts.map((post) => ({
          _id: post._id || "",
          localGuideProfileId: post.localGuideProfileId,
          title: post.title,
          description: post.description,
          content: post.content,
          category: post.category,
          location: post.location,
          images: post.images,
          tags: post.tags,
          offersGuideService: post.offersGuideService,
          status: post.status,
          views: post.views,
          likes: post.likes,
          publishedAt: post.publishedAt,
          createdAt: post.createdAt || new Date(),
          updatedAt: post.updatedAt || new Date(),
        })),
        total: result.total,
        currentPage: result.currentPage,
        totalPages: result.totalPages,
      };
    }

    // Default: get published posts
    const result = await this._volunteerPostRepository.findPublished(
      postFilters,
      pagination
    );

    return {
      posts: result.posts.map((post) => ({
        _id: post._id || "",
        localGuideProfileId: post.localGuideProfileId,
        title: post.title,
        description: post.description,
        content: post.content,
        category: post.category,
        location: post.location,
        images: post.images,
        tags: post.tags,
        offersGuideService: post.offersGuideService,
        status: post.status,
        views: post.views,
        likes: post.likes,
        publishedAt: post.publishedAt,
        createdAt: post.createdAt || new Date(),
        updatedAt: post.updatedAt || new Date(),
      })),
      total: result.total,
      currentPage: result.currentPage,
      totalPages: result.totalPages,
    };
  }
}

