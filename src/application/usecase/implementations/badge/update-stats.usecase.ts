import { inject, injectable } from "tsyringe";

import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ILocalGuideBookingRepository } from "../../../../domain/repositoryInterfaces/local-guide-booking/local-guide-booking-repository.interface";
import { ILocalGuideProfileRepository } from "../../../../domain/repositoryInterfaces/local-guide-profile/local-guide-profile-repository.interface";
import { IVolunteerPostRepository } from "../../../../domain/repositoryInterfaces/volunteer-post/volunteer-post-repository.interface";
import {
  ERROR_MESSAGE,
  EVENT_EMMITER_TYPE,
} from "../../../../shared/constants";
import { eventBus } from "../../../../shared/eventBus";
import { IUpdateLocalGuideStatsUsecase } from "../../interfaces/badge/update-stats.interface";

@injectable()
export class UpdateLocalGuideStatsUsecase
  implements IUpdateLocalGuideStatsUsecase
{
  constructor(
    @inject("ILocalGuideProfileRepository")
    private readonly _localGuideProfileRepository: ILocalGuideProfileRepository,
    @inject("IVolunteerPostRepository")
    private readonly _volunteerPostRepository: IVolunteerPostRepository,
    @inject("ILocalGuideBookingRepository")
    private readonly _localGuideBookingRepository: ILocalGuideBookingRepository
  ) {}

  async execute(
    guideProfileId: string,
    options?: {
      trigger:
        | "service_completion"
        | "post_creation"
        | "post_like"
        | "post_view";
    }
  ): Promise<{
    totalLikes: number;
    totalViews: number;
    maxPostLikes: number;
    maxPostViews: number;
    completionRate: number;
    completedSessions: number;
    totalSessions: number;
    averageRating: number;
    totalRatings: number;
    totalEarnings: number;
  }> {
    /**
     *Get current profile to ensure it exists and to preserve derived stats
     */
    const profile = await this._localGuideProfileRepository.findById(
      guideProfileId
    );

    if (!profile) {
      throw new NotFoundError(
        ERROR_MESSAGE.LOCAL_GUIDE.LOCAL_GUIDE_PROFILE_NOT_FOUND
      );
    }

    /**
     *Get post engagement stats
     */
    const postStats =
      await this._volunteerPostRepository.aggregateLikesAndViews(
        guideProfileId
      );

    /**
     *Get service stats
     */
    const serviceStats =
      await this._localGuideBookingRepository.getServiceStats(guideProfileId);

    /**
     *Get earnings stats
     */
    const earningsStats =
      await this._localGuideBookingRepository.getEarningsStats(guideProfileId);

    /**
     *Get rating stats from local guide bookings
     */
    const ratingStats =
      await this._localGuideBookingRepository.getRatingStats(guideProfileId);

    /**
     *Update stats in database
     */
    const updatedProfile = await this._localGuideProfileRepository.updateStats(
      guideProfileId,
      {
        totalLikes: postStats.totalLikes,
        totalViews: postStats.totalViews,
        maxPostLikes: postStats.maxPostLikes,
        maxPostViews: postStats.maxPostViews,
        completionRate: serviceStats.completionRate,
        completedSessions: serviceStats.completedSessions,
        totalSessions: serviceStats.totalSessions,
        averageRating: ratingStats.averageRating,
        totalRatings: ratingStats.totalRatings,
        totalEarnings: earningsStats.totalEarnings,
        totalPosts: profile.stats.totalPosts,
      }
    );

    if (!updatedProfile) {
      throw new Error(`Failed to update stats for profile: ${guideProfileId}`);
    }

    /**
     *Emit event for badge evaluation
     */
    eventBus.emit(EVENT_EMMITER_TYPE.LOCAL_GUIDE_STATS_UPDATED, {
      guideProfileId,
      stats: {
        totalLikes: postStats.totalLikes,
        totalViews: postStats.totalViews,
        maxPostLikes: postStats.maxPostLikes,
        maxPostViews: postStats.maxPostViews,
        completionRate: serviceStats.completionRate,
        completedSessions: serviceStats.completedSessions,
        totalSessions: serviceStats.totalSessions,
        averageRating: updatedProfile.stats.averageRating,
        totalRatings: updatedProfile.stats.totalRatings,
        totalPosts: updatedProfile.stats.totalPosts,
      },
      trigger: options?.trigger,
    });

    return {
      totalLikes: postStats.totalLikes,
      totalViews: postStats.totalViews,
      maxPostLikes: postStats.maxPostLikes,
      maxPostViews: postStats.maxPostViews,
      completionRate: serviceStats.completionRate,
      completedSessions: serviceStats.completedSessions,
      totalSessions: serviceStats.totalSessions,
      averageRating: ratingStats.averageRating,
      totalRatings: ratingStats.totalRatings,
      totalEarnings: earningsStats.totalEarnings,
    };
  }
}
