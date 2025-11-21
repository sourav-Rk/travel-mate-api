import { inject, injectable } from "tsyringe";

import { GetVolunteerPostsByLocationReqDTO } from "../../../../application/dto/request/volunteer-post.dto";
import { VolunteerPostListDto } from "../../../../application/dto/response/volunteer-post.dto";
import { IVolunteerPostRepository } from "../../../../domain/repositoryInterfaces/volunteer-post/volunteer-post-repository.interface";
import { VolunteerPostMapper } from "../../../mapper/volunteer-post.mapper";
import { IGetVolunteerPostsByLocationUsecase } from "../../interfaces/volunteer-post/get-volunteer-posts-by-location-usecase.interface";

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
    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 10;

    const longitude = this._toNumber(filters.longitude);
    const latitude = this._toNumber(filters.latitude);
    const radiusInMeters = this._toNumber(filters.radiusInMeters) || 10000;

    const offersGuideService =
      typeof filters.offersGuideService === "string"
        ? filters.offersGuideService === "true"
        : filters.offersGuideService;

    const boundingBox = filters.boundingBox
      ? {
          north: this._toNumber(filters.boundingBox.north),
          south: this._toNumber(filters.boundingBox.south),
          east: this._toNumber(filters.boundingBox.east),
          west: this._toNumber(filters.boundingBox.west),
        }
      : undefined;

    const postFilters = {
      category: filters.category,
      offersGuideService,
    };

    const pagination = {
      page,
      limit,
      sortBy: filters.sortBy,
    };

    let result;

    /**
     *Check if bounding box search is requested
     */
    if (
      boundingBox &&
      [
        boundingBox.north,
        boundingBox.south,
        boundingBox.east,
        boundingBox.west,
      ].some((value) => value === undefined)
    ) {
      throw new Error("Invalid bounding box coordinates");
    }

    if (boundingBox) {
      if (
        boundingBox.north === undefined ||
        boundingBox.south === undefined ||
        boundingBox.east === undefined ||
        boundingBox.west === undefined
      ) {
        throw new Error("Invalid bounding box coordinates");
      }

      const centerLongitude = (boundingBox.west + boundingBox.east) / 2;
      const centerLatitude = (boundingBox.north + boundingBox.south) / 2;

      result = await this._volunteerPostRepository.findByBoundingBox(
        {
          north: boundingBox.north,
          south: boundingBox.south,
          east: boundingBox.east,
          west: boundingBox.west,
        },
        { longitude: centerLongitude, latitude: centerLatitude },
        postFilters,
        pagination
      );
    } else if (longitude !== undefined && latitude !== undefined) {
      /**
       *Radius-based search
       */
      const locationQuery = {
        longitude,
        latitude,
        radiusInMeters,
      };

      result = await this._volunteerPostRepository.findByLocation(
        locationQuery,
        postFilters,
        pagination
      );
    } else {
      throw new Error("Either longitude/latitude or boundingBox is required");
    }

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

  private _toNumber(value?: number | string): number | undefined {
    if (value === undefined || value === null || value === "") {
      return undefined;
    }
    if (typeof value === "number") {
      return value;
    }
    const parsed = Number(value);
    return Number.isNaN(parsed) ? undefined : parsed;
  }
}
