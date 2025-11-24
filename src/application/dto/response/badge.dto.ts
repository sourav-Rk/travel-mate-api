import { BadgeCategory, BadgeCriteriaType } from "../../../domain/entities/badge.entity";

export interface BadgeDto {
  id: string;
  badgeId: string;
  name: string;
  description: string;
  category: BadgeCategory;
  icon?: string;
  criteria: Array<{
    type: BadgeCriteriaType;
    value: number;
    additionalCondition?: {
      type: BadgeCriteriaType;
      value: number;
    };
  }>;
  priority?: number;
  isActive?: boolean;
  isEarned?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BadgeEarnedDto {
  badgeId: string;
  badgeName: string;
  earnedAt: Date;
}

export interface GuideBadgesResponse {
  earnedBadges: string[];
  allBadges: BadgeDto[];
  totalEarned: number;
  totalAvailable: number;
}

export interface BadgeListResponse {
  badges: BadgeDto[];
  total: number;
}






