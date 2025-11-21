import { inject, injectable } from "tsyringe";

import { ILocalGuideProfileRepository } from "../../../../domain/repositoryInterfaces/local-guide-profile/local-guide-profile-repository.interface";
import { IGetBadgesUsecase } from "../../interfaces/badge/get-badges.interface";
import { ALL_BADGES } from "../../../../domain/constants/badges/badge-definitions";

@injectable()
export class GetBadgesUsecase implements IGetBadgesUsecase {
  constructor(
    @inject("ILocalGuideProfileRepository")
    private readonly _localGuideProfileRepository: ILocalGuideProfileRepository
  ) {}

  async getAllBadges(): Promise<
    Array<{
      id: string;
      name: string;
      description: string;
      category: string;
      icon?: string;
      isEarned: boolean;
    }>
  > {
 
    /**
     *Return all badges without earned status (for general listing) 
     */
    return ALL_BADGES.map((badge) => ({
      id: badge.id,
      name: badge.name,
      description: badge.description,
      category: badge.category,
      icon: badge.icon,
      isEarned: false, // No guide context, so all false
    }));
  }

  async getGuideBadges(guideProfileId: string): Promise<{
    earnedBadges: string[];
    allBadges: Array<{
      id: string;
      name: string;
      description: string;
      category: string;
      icon?: string;
      isEarned: boolean;
    }>;
  }> {
  
    /**
     *Get earned badges for this guide 
     */
    const earnedBadges = await this._localGuideProfileRepository.getBadges(
      guideProfileId
    );

    const earnedBadgesSet = new Set(earnedBadges);

    /**
     *Map all badges with earned status 
     */
    const allBadges = ALL_BADGES.map((badge) => ({
      id: badge.id,
      name: badge.name,
      description: badge.description,
      category: badge.category,
      icon: badge.icon,
      isEarned: earnedBadgesSet.has(badge.id),
    }));

    return {
      earnedBadges,
      allBadges,
    };
  }

  async getBadgeById(badgeId: string): Promise<{
    id: string;
    name: string;
    description: string;
    category: string;
    icon?: string;
  } | null> {
    const badge = ALL_BADGES.find((b) => b.id === badgeId);

    if (!badge) {
      return null;
    }

    return {
      id: badge.id,
      name: badge.name,
      description: badge.description,
      category: badge.category,
      icon: badge.icon,
    };
  }
}





