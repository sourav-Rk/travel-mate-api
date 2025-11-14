import { inject, injectable } from "tsyringe";

import { SearchVolunteerPostsReqDTO } from "../../../../application/dto/request/volunteer-post.dto";
import { VolunteerPostListDto } from "../../../../application/dto/response/volunteer-post.dto";
import { IVolunteerPostRepository } from "../../../../domain/repositoryInterfaces/volunteer-post/volunteer-post-repository.interface";
import { ISearchVolunteerPostsUsecase } from "../../interfaces/volunteer-post/search-volunteer-posts-usecase.interface";
import { VolunteerPostMapper } from "../../../mapper/volunteer-post.mapper";

@injectable()
export class SearchVolunteerPostsUsecase
  implements ISearchVolunteerPostsUsecase
{
  constructor(
    @inject("IVolunteerPostRepository")
    private _volunteerPostRepository: IVolunteerPostRepository
  ) {}

  async execute(
    filters: SearchVolunteerPostsReqDTO
  ): Promise<VolunteerPostListDto> {
    const page = filters.page || 1;
    const limit = filters.limit || 10;

    const postFilters = {
      category: filters.category,
      offersGuideService: filters.offersGuideService,
    };

    const pagination = {
      page,
      limit,
      sortBy: filters.sortBy,
    };

    const result = await this._volunteerPostRepository.search(
      filters.searchTerm,
      postFilters,
      pagination
    );

    const mappedPosts = result.posts.map((post) => {
      return VolunteerPostMapper.mapToListItemDto(post);
    });
    
    return {
      posts: mappedPosts,
      total: result.total,
      currentPage: result.currentPage,
      totalPages: result.totalPages,
    };
  }
}
