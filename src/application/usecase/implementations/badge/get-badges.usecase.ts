import { inject, injectable } from "tsyringe";

import { ValidationError } from "../../../../domain/errors/validationError";
import { IBadgeRepository } from "../../../../domain/repositoryInterfaces/badge/badge-repository.interface";
import { ILocalGuideProfileRepository } from "../../../../domain/repositoryInterfaces/local-guide-profile/local-guide-profile-repository.interface";
import { ERROR_MESSAGE } from "../../../../shared/constants";
import { GetBadgesReqDTO } from "../../../dto/request/badge.dto";
import { BadgeDto } from "../../../dto/response/badge.dto";
import { IGetBadgesUsecase } from "../../interfaces/badge/get-badges.interface";

@injectable()
export class GetBadgesUsecase implements IGetBadgesUsecase {
  constructor(
    @inject("IBadgeRepository")
    private readonly _badgeRepository: IBadgeRepository,
    @inject("ILocalGuideProfileRepository")
    private readonly _localGuideProfileRepository: ILocalGuideProfileRepository
  ) {}

  async getAllBadges(filters?: GetBadgesReqDTO): Promise<{
    badges: BadgeDto[];
    total: number;
    currentPage: number;
    totalPages: number;
  }> {
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const validPage = Math.max(1, page);
    const validLimit = Math.max(1, Math.min(100, limit));

    const repositoryFilters = {
      isActive: filters?.isActive,
      category: filters?.category,
      search: filters?.search,
      page: validPage,
      limit: validLimit,
    };

    const { badges, total } = await this._badgeRepository.findAll(
      repositoryFilters
    );

    const totalPages = Math.ceil(total / validLimit);

    return {
      badges: badges.map((badge) => ({
        id: badge.badgeId,
        badgeId: badge.badgeId,
        name: badge.name,
        description: badge.description,
        category: badge.category,
        icon: badge.icon,
        criteria: badge.criteria,
        priority: badge.priority,
        isActive: badge.isActive,
        createdAt: badge.createdAt,
        updatedAt: badge.updatedAt,
      })),
      total,
      currentPage: validPage,
      totalPages,
    };
  }

  async getGuideBadges(guideProfileId: string): Promise<{
    earnedBadges: string[];
    allBadges: BadgeDto[];
  }> {
    if (!guideProfileId) {
      throw new ValidationError(ERROR_MESSAGE.ID_REQUIRED);
    }

    /**
     *Get earned badges for this guide
     */
    const earnedBadges = await this._localGuideProfileRepository.getBadges(
      guideProfileId
    );

    const earnedBadgesSet = new Set(earnedBadges);

    /**
     *Get all active badges from database (no pagination for guide badges)
     */
    const { badges: allBadgesEntities } = await this._badgeRepository.findAll({
      isActive: true,
    });

    /**
     *Map all badges with earned status
     */
    const allBadges: BadgeDto[] = allBadgesEntities.map((badge) => ({
      id: badge.badgeId,
      badgeId: badge.badgeId,
      name: badge.name,
      description: badge.description,
      category: badge.category,
      icon: badge.icon,
      criteria: badge.criteria,
      priority: badge.priority,
      isActive: badge.isActive,
      isEarned: earnedBadgesSet.has(badge.badgeId),
      createdAt: badge.createdAt,
      updatedAt: badge.updatedAt,
    }));

    return {
      earnedBadges,
      allBadges,
    };
  }

  async getBadgeById(badgeId: string): Promise<BadgeDto | null> {
    const badge = await this._badgeRepository.findByBadgeId(badgeId);

    if (!badge) {
      return null;
    }

    return {
      id: badge.badgeId,
      badgeId: badge.badgeId,
      name: badge.name,
      description: badge.description,
      category: badge.category,
      icon: badge.icon,
      criteria: badge.criteria,
      priority: badge.priority,
      isActive: badge.isActive,
      createdAt: badge.createdAt,
      updatedAt: badge.updatedAt,
    };
  }
}
