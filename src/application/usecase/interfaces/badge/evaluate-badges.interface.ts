export interface IEvaluateBadgesUsecase {
  execute(guideProfileId: string): Promise<{
    newlyAwardedBadges: string[];
    totalBadges: number;
  }>;
}




