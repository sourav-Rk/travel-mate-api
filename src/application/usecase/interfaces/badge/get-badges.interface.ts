export interface IGetBadgesUsecase {
  getAllBadges(): Promise<Array<{
    id: string;
    name: string;
    description: string;
    category: string;
    icon?: string;
    isEarned: boolean;
  }>>;
  
  getGuideBadges(guideProfileId: string): Promise<{
    earnedBadges: string[];
    allBadges: Array<{
      id: string;
      name: string;
      description: string;
      category: string;
      icon?: string;
      isEarned: boolean;
    }>;
  }>;
  
  getBadgeById(badgeId: string): Promise<{
    id: string;
    name: string;
    description: string;
    category: string;
    icon?: string;
  } | null>;
}





