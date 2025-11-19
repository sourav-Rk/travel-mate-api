import { BadgeCriteriaType, IBadgeEntity } from "../../entities/badge.entity";

export const ALL_BADGES: IBadgeEntity[] = [
  /**
   *Service-Based Badges 
   */
  {
    id: "first_service",
    name: "First Service",
    description: "Complete your first booking",
    category: "service",
    icon: "🎯",
    criteria: [
      {
        type: BadgeCriteriaType.COMPLETED_SERVICES,
        value: 1,
      },
    ],
    priority: 1,
  },
  {
    id: "service_5",
    name: "Service Starter",
    description: "Complete 5 bookings",
    category: "service",
    icon: "⭐",
    criteria: [
      {
        type: BadgeCriteriaType.COMPLETED_SERVICES,
        value: 5,
      },
    ],
    priority: 2,
  },
  {
    id: "service_10",
    
    name: "Service Provider",
    description: "Complete 10 bookings",
    category: "service",
    icon: "🌟",
    criteria: [
      {
        type: BadgeCriteriaType.COMPLETED_SERVICES,
        value: 10,
      },
    ],
    priority: 3,
  },
  {
    id: "service_25",
    name: "Experienced Guide",
    description: "Complete 25 bookings",
    category: "service",
    icon: "🏆",
    criteria: [
      {
        type: BadgeCriteriaType.COMPLETED_SERVICES,
        value: 25,
      },
    ],
    priority: 4,
  },
  {
    id: "service_50",
    name: "Veteran Guide",
    description: "Complete 50 bookings",
    category: "service",
    icon: "👑",
    criteria: [
      {
        type: BadgeCriteriaType.COMPLETED_SERVICES,
        value: 50,
      },
    ],
    priority: 5,
  },
  {
    id: "service_100",
    name: "Master Guide",
    description: "Complete 100 bookings",
    category: "service",
    icon: "💎",
    criteria: [
      {
        type: BadgeCriteriaType.COMPLETED_SERVICES,
        value: 100,
      },
    ],
    priority: 6,
  },
  {
    id: "perfect_rating",
    name: "Perfect Service",
    description: "Maintain a 5.0 average rating with 10+ reviews",
    category: "service",
    icon: "✨",
    criteria: [
      {
        type: BadgeCriteriaType.AVERAGE_RATING,
        value: 5.0,
        additionalCondition: {
          type: BadgeCriteriaType.TOTAL_RATINGS,
          value: 10,
        },
      },
    ],
    priority: 7,
  },
  {
    id: "reliable_guide",
    name: "Reliable Guide",
    description: "Maintain 95%+ completion rate with 20+ services",
    category: "service",
    icon: "🛡️",
    criteria: [
      {
        type: BadgeCriteriaType.COMPLETION_RATE,
        value: 95,
        additionalCondition: {
          type: BadgeCriteriaType.COMPLETED_SERVICES,
          value: 20,
        },
      },
    ],
    priority: 8,
  },

  
  /**
   *Content-Based Badges
   */
  {
    id: "first_post",
    name: "First Post",
    description: "Create your first post",
    category: "content",
    icon: "📝",
    criteria: [
      {
        type: BadgeCriteriaType.TOTAL_POSTS,
        value: 1,
      },
    ],
    priority: 9,
  },
  {
    id: "posts_5",
    name: "Content Creator",
    description: "Create 5 posts",
    category: "content",
    icon: "📸",
    criteria: [
      {
        type: BadgeCriteriaType.TOTAL_POSTS,
        value: 5,
      },
    ],
    priority: 10,
  },
  {
    id: "posts_10",
    name: "Active Poster",
    description: "Create 10 posts",
    category: "content",
    icon: "📷",
    criteria: [
      {
        type: BadgeCriteriaType.TOTAL_POSTS,
        value: 10,
      },
    ],
    priority: 11,
  },
  {
    id: "posts_25",
    name: "Community Contributor",
    description: "Create 25 posts",
    category: "content",
    icon: "📚",
    criteria: [
      {
        type: BadgeCriteriaType.TOTAL_POSTS,
        value: 25,
      },
    ],
    priority: 12,
  },
  {
    id: "posts_50",
    name: "Content Master",
    description: "Create 50 posts",
    category: "content",
    icon: "🎨",
    criteria: [
      {
        type: BadgeCriteriaType.TOTAL_POSTS,
        value: 50,
      },
    ],
    priority: 13,
  },

  /**
   *Engagement-Based Badges 
   */
  {
    id: "likes_100",
    name: "Like Magnet",
    description: "Receive 100 total likes across all posts",
    category: "engagement",
    icon: "❤️",
    criteria: [
      {
        type: BadgeCriteriaType.TOTAL_LIKES,
        value: 100,
      },
    ],
    priority: 14,
  },
  {
    id: "likes_500",
    name: "Popular Guide",
    description: "Receive 500 total likes",
    category: "engagement",
    icon: "🔥",
    criteria: [
      {
        type: BadgeCriteriaType.TOTAL_LIKES,
        value: 500,
      },
    ],
    priority: 15,
  },
  {
    id: "likes_1000",
    name: "Community Favorite",
    description: "Receive 1000 total likes",
    category: "engagement",
    icon: "💖",
    criteria: [
      {
        type: BadgeCriteriaType.TOTAL_LIKES,
        value: 1000,
      },
    ],
    priority: 16,
  },
  {
    id: "views_10",
    name: "View Starter",
    description: "Receive 10 total views",
    category: "engagement",
    icon: "👀",
    criteria: [
      {
        type: BadgeCriteriaType.TOTAL_VIEWS,
        value: 10,
      },
    ],
    priority: 17,
  },
  {
    id: "views_1000",
    name: "View Master",
    description: "Receive 1000 total views",
    category: "engagement",
    icon: "👁️",
    criteria: [
      {
        type: BadgeCriteriaType.TOTAL_VIEWS,
        value: 1000,
      },
    ],
    priority: 18,
  },
  {
    id: "views_10000",
    name: "Viral Guide",
    description: "Receive 10000 total views",
    category: "engagement",
    icon: "🚀",
    criteria: [
      {
        type: BadgeCriteriaType.TOTAL_VIEWS,
        value: 10000,
      },
    ],
    priority: 19,
  },
  {
    id: "post_likes_100",
    name: "Popular Post",
    description: "Single post with 100+ likes",
    category: "engagement",
    icon: "💯",
    criteria: [
      {
        type: BadgeCriteriaType.MAX_POST_LIKES,
        value: 100,
      },
    ],
    priority: 20,
  },
  {
    id: "post_views_1000",
    name: "Viral Post",
    description: "Single post with 1000+ views",
    category: "engagement",
    icon: "📈",
    criteria: [
      {
        type: BadgeCriteriaType.MAX_POST_VIEWS,
        value: 1000,
      },
    ],
    priority: 21,
  },

  /**
   *Special Achievement Badges 
   */
  {
    id: "rising_star",
    name: "Rising Star",
    description: "Complete 10 services and create 5 posts in your first month",
    category: "achievement",
    icon: "⭐",
    criteria: [
      {
        type: BadgeCriteriaType.SERVICES_AND_POSTS,
        value: 10, // services
        additionalCondition: {
          type: BadgeCriteriaType.TOTAL_POSTS,
          value: 5, // posts
        },
      },
    ],
    priority: 22,
  },
  {
    id: "community_leader",
    name: "Community Leader",
    description: "Create 50+ posts and receive 1000+ total likes",
    category: "achievement",
    icon: "👑",
    criteria: [
      {
        type: BadgeCriteriaType.POSTS_AND_LIKES,
        value: 50, // posts
        additionalCondition: {
          type: BadgeCriteriaType.TOTAL_LIKES,
          value: 1000, // likes
        },
      },
    ],
    priority: 23,
  },
  {
    id: "service_expert",
    name: "Service Expert",
    description: "Complete 100+ services with 4.5+ average rating",
    category: "achievement",
    icon: "🏅",
    criteria: [
      {
        type: BadgeCriteriaType.SERVICES_AND_RATING,
        value: 100, // services
        additionalCondition: {
          type: BadgeCriteriaType.AVERAGE_RATING,
          value: 4.5, // rating
        },
      },
    ],
    priority: 24,
  },
];


