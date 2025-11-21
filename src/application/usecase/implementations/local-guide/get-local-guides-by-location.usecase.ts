import { inject, injectable } from "tsyringe";

import { GetLocalGuidesByLocationReqDTO } from "../../../../application/dto/request/local-guide.dto";
import {
  LocalGuideListDto,
  LocalGuideWithDistanceDto,
} from "../../../../application/dto/response/local-guide.dto";
import { ILocalGuideProfileRepository } from "../../../../domain/repositoryInterfaces/local-guide-profile/local-guide-profile-repository.interface";
import { LocalGuideProfileMapper } from "../../../mapper/local-guide-profile.mapper";
import { IGetLocalGuidesByLocationUsecase } from "../../interfaces/local-guide/get-local-guides-by-location.interface";

@injectable()
export class GetLocalGuidesByLocationUsecase
  implements IGetLocalGuidesByLocationUsecase
{
  constructor(
    @inject("ILocalGuideProfileRepository")
    private _localGuideProfileRepository: ILocalGuideProfileRepository
  ) {}

  async execute(
    filters: GetLocalGuidesByLocationReqDTO
  ): Promise<LocalGuideListDto> {
    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 10;

    const longitude = this._toNumber(filters.longitude);
    const latitude = this._toNumber(filters.latitude);
    const radiusInMeters = this._toNumber(filters.radiusInMeters) || 10000;

    const specialties = Array.isArray(filters.specialties)
      ? filters.specialties
      : filters.specialties
      ? [filters.specialties]
      : undefined;

    const isAvailable =
      typeof filters.isAvailable === "string"
        ? filters.isAvailable === "true"
        : filters.isAvailable;

    const minRating = this._toNumber(filters.minRating);

    const boundingBox = filters.boundingBox
      ? {
          north: this._toNumber(filters.boundingBox.north),
          south: this._toNumber(filters.boundingBox.south),
          east: this._toNumber(filters.boundingBox.east),
          west: this._toNumber(filters.boundingBox.west),
        }
      : undefined;

    const guideFilters = {
      isAvailable,
      specialties,
      minRating,
    };

    const pagination = {
      page,
      limit,
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
      const strictBox = {
        north: Number(boundingBox.north),
        south: Number(boundingBox.south),
        east: Number(boundingBox.east),
        west: Number(boundingBox.west),
      };
      result = await this._localGuideProfileRepository.findByBoundingBox(
        strictBox,
        guideFilters,
        pagination
      );
    } else if (longitude !== undefined && latitude !== undefined) {
      /**
       *Radius-based search
       */
      result = await this._localGuideProfileRepository.findNearbyGuides(
        longitude,
        latitude,
        radiusInMeters,
        guideFilters,
        pagination
      );
    } else {
      throw new Error("Either longitude/latitude or boundingBox is required");
    }

    const mappedGuides: LocalGuideWithDistanceDto[] = result.guides.map(
      ({ entity, userDetails, distance }) => {
        const dto = LocalGuideProfileMapper.toDto(
          entity,
          userDetails
        );
        return {
          ...dto,
          distance,
        };
      }
    );

    return {
      guides: mappedGuides,
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
