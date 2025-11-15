import { REVIEWTARGET } from "../../../../shared/constants";

export interface IAddReviewUsecase {
  execute(
    userId: string,
    targetType: REVIEWTARGET,
    rating: number,
    comment: string,
    packageId?: string,
    guideId?: string
  ): Promise<void>;
}
