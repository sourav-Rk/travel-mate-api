export interface IBadgeEntity {
  _id?: string;
  badgeId: string;
  name: string;
  description: string;
  category: BadgeCategory;
  icon?: string;
  criteria: IBadgeCriteria[];
  priority?: number;
  isActive?: boolean;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum BadgeCategory {
  SERVICE = "service",
  CONTENT = "content",
  ENGAGEMENT = "engagement",
  ACHIEVEMENT = "achievement",
}

export enum BadgeCriteriaType {
  COMPLETED_SERVICES = "completed_services",
  TOTAL_POSTS = "total_posts",
  TOTAL_LIKES = "total_likes",
  TOTAL_VIEWS = "total_views",
  MAX_POST_LIKES = "max_post_likes",
  MAX_POST_VIEWS = "max_post_views",
  AVERAGE_RATING = "average_rating",
  TOTAL_RATINGS = "total_ratings",
  COMPLETION_RATE = "completion_rate",
  SERVICES_AND_POSTS = "services_and_posts",
  POSTS_AND_LIKES = "posts_and_likes",
  SERVICES_AND_RATING = "services_and_rating",
}

export interface IBadgeCriteria {
  type: BadgeCriteriaType;
  value: number;
  additionalCondition?: {
    type: BadgeCriteriaType;
    value: number;
  };
}



