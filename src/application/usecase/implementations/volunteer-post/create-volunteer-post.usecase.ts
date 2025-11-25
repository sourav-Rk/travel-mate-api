import { inject, injectable } from "tsyringe";

import { CreateVolunteerPostReqDTO } from "../../../../application/dto/request/volunteer-post.dto";
import { CustomError } from "../../../../domain/errors/customError";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ValidationError } from "../../../../domain/errors/validationError";
import { IClientRepository } from "../../../../domain/repositoryInterfaces/client/client.repository.interface";
import { ILocalGuideProfileRepository } from "../../../../domain/repositoryInterfaces/local-guide-profile/local-guide-profile-repository.interface";
import { IVolunteerPostRepository } from "../../../../domain/repositoryInterfaces/volunteer-post/volunteer-post-repository.interface";
import {
  ERROR_MESSAGE,
  HTTP_STATUS,
  POST_STATUS,
  VERIFICATION_STATUS,
} from "../../../../shared/constants";
import { IUpdateLocalGuideStatsUsecase } from "../../interfaces/badge/update-stats.interface";
import { ICreateVolunteerPostUsecase } from "../../interfaces/volunteer-post/create-volunteer-post-usecase.interface";

@injectable()
export class CreateVolunteerPostUsecase implements ICreateVolunteerPostUsecase {
  constructor(
    @inject("IClientRepository")
    private _clientRepository: IClientRepository,
    @inject("ILocalGuideProfileRepository")
    private _localGuideProfileRepository: ILocalGuideProfileRepository,
    @inject("IVolunteerPostRepository")
    private _volunteerPostRepository: IVolunteerPostRepository,
    @inject("IUpdateLocalGuideStatsUsecase")
    private _updateLocalGuideStatsUsecase: IUpdateLocalGuideStatsUsecase
  ) {}

  async execute(
    userId: string,
    data: CreateVolunteerPostReqDTO
  ): Promise<void> {
    if (!userId) {
      throw new ValidationError(ERROR_MESSAGE.ID_REQUIRED);
    }

    const user = await this._clientRepository.findById(userId);
    if (!user) {
      throw new NotFoundError(ERROR_MESSAGE.USER_NOT_FOUND);
    }

    const profile = await this._localGuideProfileRepository.findByUserId(
      userId
    );
    if (!profile) {
      throw new NotFoundError(
        ERROR_MESSAGE.VOLUNTEER_POST.LOCAL_GUIDE_PROFILE_NOT_FOUND
      );
    }

    if (profile.verificationStatus !== VERIFICATION_STATUS.VERIFIED) {
      throw new CustomError(
        HTTP_STATUS.FORBIDDEN,
        ERROR_MESSAGE.VOLUNTEER_POST.GUIDE_NOT_VERIFIED
      );
    }

    /**
     * Validate coordinates
     */
    const [longitude, latitude] = data.location.coordinates;
    if (
      longitude < -180 ||
      longitude > 180 ||
      latitude < -90 ||
      latitude > 90
    ) {
      throw new CustomError(
        HTTP_STATUS.BAD_REQUEST,
        ERROR_MESSAGE.VOLUNTEER_POST.INVALID_COORDINATES
      );
    }

    /**
     *Validate hourlyRate in profile if offering service
     */
    if (data.offersGuideService && !profile.hourlyRate) {
      throw new ValidationError(
        ERROR_MESSAGE.VOLUNTEER_POST.PROFILE_HOURLY_RATE_REQUIRED
      );
    }

    if (data.images && data.images.length > 10) {
      throw new ValidationError(
        ERROR_MESSAGE.VOLUNTEER_POST.MAX_IMAGES_EXCEEDED
      );
    }

    /**
     *Validate tags count
     */
    if (data.tags && data.tags.length > 20) {
      throw new ValidationError(ERROR_MESSAGE.VOLUNTEER_POST.MAX_TAGS_EXCEEDED);
    }

    // Create post - always set status to published
    await this._volunteerPostRepository.save({
      localGuideProfileId: profile._id || "",
      title: data.title,
      description: data.description,
      content: data.content,
      category: data.category,
      location: {
        type: "Point",
        coordinates: [longitude, latitude],
        city: data.location.city,
        state: data.location.state,
        country: data.location.country,
      },
      images: data.images || [],
      tags: data.tags || [],
      offersGuideService: data.offersGuideService,
      status: POST_STATUS.PUBLISHED,
      views: 0,
      likes: 0,
      publishedAt: new Date(),
    });

    await this._localGuideProfileRepository.updateByUserId(userId, {
      stats: {
        ...profile.stats,
        totalPosts: profile.stats.totalPosts + 1,
      },
    });

    /**
     * Update guide stats and trigger badge evaluation
     */
    try {
      await this._updateLocalGuideStatsUsecase.execute(profile._id || "", {
        trigger: "post_creation",
      });
    } catch (error) {
      console.error("Error updating guide stats for badge evaluation:", error);
    }
  }
}
