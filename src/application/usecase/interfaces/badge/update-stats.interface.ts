export interface UpdateStatsTrigger {
  trigger: "service_completion" | "post_creation" | "post_like" | "post_view";
}

export interface IUpdateLocalGuideStatsUsecase {
  execute(
    guideProfileId: string,
    options?: UpdateStatsTrigger
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
  }>;
}

