export interface BadgeDto {
  id: string;
  name: string;
  description: string;
  category: "service" | "content" | "engagement" | "achievement";
  icon?: string;
  isEarned: boolean;
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






