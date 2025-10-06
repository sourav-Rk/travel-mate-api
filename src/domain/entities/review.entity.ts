export interface IReviewEntity {
  _id: string;
  userId: string;
  targetType: "guide" | "package";
  guideId?: string;
  packageId?: string;
  rating: number;
  comment?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
