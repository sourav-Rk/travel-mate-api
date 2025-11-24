import { GetBadgesReqDTO } from "../../../dto/request/badge.dto";
import { BadgeDto } from "../../../dto/response/badge.dto";

export interface IGetBadgesUsecase {
  getAllBadges(filters?: GetBadgesReqDTO): Promise<{
    badges: BadgeDto[];
    total: number;
    currentPage: number;
    totalPages: number;
  }>;
  
  getGuideBadges(guideProfileId: string): Promise<{
    earnedBadges: string[];
    allBadges: BadgeDto[];
  }>;
  
  getBadgeById(badgeId: string): Promise<BadgeDto | null>;
}






