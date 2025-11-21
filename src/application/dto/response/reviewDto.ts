
// export interface ReviewListWithUserDetailsDto {
//   _id: string;
//   userId: IClientEntity;
//   rating: number;
//   averageRating :number;
//   totalReviews : number;
//   comment: string;
//   createdAt: Date;
// }

export interface ReviewListDto {
  _id: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface ReviewListWithUserDetailsDto {
  _id: string;
  rating: number;
  comment: string;
  createdAt: Date;
  userDetails: {
    _id: string;
    firstName: string;
    lastName: string;
    profileImage?: string;
  };
}

export interface ReviewAggregateResult {
  reviews: ReviewListWithUserDetailsDto[];
  averageRating: number;
  totalReviews: number;
}

export interface PackageReviewListWithUserDetailsAndAverageRatingDto {
  reviews: ReviewListDto[];
  averageRating: number;
  totalReviews: number;
}
