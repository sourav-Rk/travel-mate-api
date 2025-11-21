import { inject, injectable } from "tsyringe";

import { ALL_BADGES } from "../../../../domain/constants/badges/badge-definitions";
import { BadgeCriteriaType } from "../../../../domain/entities/badge.entity";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ILocalGuideProfileRepository } from "../../../../domain/repositoryInterfaces/local-guide-profile/local-guide-profile-repository.interface";
import { ERROR_MESSAGE } from "../../../../shared/constants";
import { IEvaluateBadgesUsecase } from "../../interfaces/badge/evaluate-badges.interface";

@injectable()
export class EvaluateBadgesUsecase implements IEvaluateBadgesUsecase {
  constructor(
    @inject("ILocalGuideProfileRepository")
    private readonly _localGuideProfileRepository: ILocalGuideProfileRepository
  ) {}

  async execute(guideProfileId: string): Promise<{
    newlyAwardedBadges: string[];
    totalBadges: number;
  }> { 
    /**
     *Get current profile with stats 
     */
    const profile = await this._localGuideProfileRepository.findById(
      guideProfileId
    );

    if (!profile) {
      throw new NotFoundError(ERROR_MESSAGE.LOCAL_GUIDE.LOCAL_GUIDE_PROFILE_NOT_FOUND);
    }
 
    /**
     *Get currently earned badges 
     */
    const earnedBadges = profile.badges || [];

    /**
     *Evaluate all badges 
     */
    const newlyAwardedBadges: string[] = [];

    for (const badge of ALL_BADGES) {
      /**
       * Skip if already earned 
       */
      if (earnedBadges.includes(badge.id)) {
        continue;
      }

      /**
       *Check if badge criteria are met 
       */
      if (this._evaluateBadgeCriteria(badge.criteria, profile.stats)) {
        /**
         *Award badge 
         */
        await this._localGuideProfileRepository.addBadge(
          guideProfileId,
          badge.id
        );
        newlyAwardedBadges.push(badge.id);
      }
    }

    /**
     *Get updated badge count 
     */
    const updatedProfile = await this._localGuideProfileRepository.findById(
      guideProfileId
    );
    const totalBadges = updatedProfile?.badges?.length || 0;

    return {
      newlyAwardedBadges,
      totalBadges,
    };
  }

  private _evaluateBadgeCriteria(
    criteria: Array<{
      type: BadgeCriteriaType;
      value: number;
      additionalCondition?: {
        type: BadgeCriteriaType;
        value: number;
      };
    }>,
    stats: {
      totalSessions: number;
      completedSessions: number;
      averageRating: number;
      totalRatings: number;
      totalPosts: number;
      totalEarnings: number;
      totalLikes: number;
      totalViews: number;
      maxPostLikes: number;
      maxPostViews: number;
      completionRate: number;
    }
  ): boolean { 
    /**
     *All criteria in the array must be met 
     */
    for (const criterion of criteria) {
      const value = this._getStatValue(criterion.type, stats);
      if (value < criterion.value) {
        return false;
      }

      /**
       *Check additional condition if present 
       */
      if (criterion.additionalCondition) {
        const additionalValue = this._getStatValue(
          criterion.additionalCondition.type,
          stats
        );
        if (additionalValue < criterion.additionalCondition.value) {
          return false;
        }
      }
    }

    return true;
  }

  private _getStatValue(
    type: BadgeCriteriaType,
    stats: {
      totalSessions: number;
      completedSessions: number;
      averageRating: number;
      totalRatings: number;
      totalPosts: number;
      totalEarnings: number;
      totalLikes: number;
      totalViews: number;
      maxPostLikes: number;
      maxPostViews: number;
      completionRate: number;
    }
  ): number {
    switch (type) {
      case BadgeCriteriaType.COMPLETED_SERVICES:
        return stats.completedSessions;
      case BadgeCriteriaType.TOTAL_POSTS:
        return stats.totalPosts;
      case BadgeCriteriaType.TOTAL_LIKES:
        return stats.totalLikes;
      case BadgeCriteriaType.TOTAL_VIEWS:
        return stats.totalViews;
      case BadgeCriteriaType.MAX_POST_LIKES:
        return stats.maxPostLikes;
      case BadgeCriteriaType.MAX_POST_VIEWS:
        return stats.maxPostViews;
      case BadgeCriteriaType.AVERAGE_RATING:
        return stats.averageRating;
      case BadgeCriteriaType.TOTAL_RATINGS:
        return stats.totalRatings;
      case BadgeCriteriaType.COMPLETION_RATE:
        return stats.completionRate;
      case BadgeCriteriaType.SERVICES_AND_POSTS:
        // For composite badges, return completed services
        return stats.completedSessions;
      case BadgeCriteriaType.POSTS_AND_LIKES:
        // For composite badges, return total posts
        return stats.totalPosts;
      case BadgeCriteriaType.SERVICES_AND_RATING:
        // For composite badges, return completed services
        return stats.completedSessions;
      default:
        return 0;
    }
  }
}


