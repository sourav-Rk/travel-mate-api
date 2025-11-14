import { inject, injectable } from "tsyringe";

import { GetVolunteerPostsByLocationReqDTO } from "../../../../application/dto/request/volunteer-post.dto";
import { VolunteerPostListDto } from "../../../../application/dto/response/volunteer-post.dto";
import { IVolunteerPostRepository } from "../../../../domain/repositoryInterfaces/volunteer-post/volunteer-post-repository.interface";
import { IGetVolunteerPostsByLocationUsecase } from "../../interfaces/volunteer-post/get-volunteer-posts-by-location-usecase.interface";
import { VolunteerPostMapper } from "../../../mapper/volunteer-post.mapper";

@injectable()
export class GetVolunteerPostsByLocationUsecase
  implements IGetVolunteerPostsByLocationUsecase
{
  constructor(
    @inject("IVolunteerPostRepository")
    private _volunteerPostRepository: IVolunteerPostRepository
  ) {}

  async execute(
    filters: GetVolunteerPostsByLocationReqDTO
  ): Promise<VolunteerPostListDto> {
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const radiusInMeters = filters.radiusInMeters || 10000;

    const locationQuery = {
      longitude: filters.longitude,
      latitude: filters.latitude,
      radiusInMeters,
    };

    const postFilters = {
      category: filters.category,
      offersGuideService: filters.offersGuideService,
    };

    const pagination = {
      page,
      limit,
      sortBy: filters.sortBy,
    };

    const result = await this._volunteerPostRepository.findByLocation(
      locationQuery,
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
}

