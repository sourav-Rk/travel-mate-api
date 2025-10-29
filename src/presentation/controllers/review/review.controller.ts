import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import { IAddReviewUsecase } from "../../../application/usecase/interfaces/review/add-review-usecase.interface";
import { IGetGuideReviewUsecase } from "../../../application/usecase/interfaces/review/get-guide-reviews.usecase";
import { IGetPackageReviewsUsecase } from "../../../application/usecase/interfaces/review/getPackageReviews-usecase.interface";
import { ResponseHelper } from "../../../infrastructure/config/server/helpers/response.helper";
import { HTTP_STATUS, SUCCESS_MESSAGE } from "../../../shared/constants";
import { IReviewController } from "../../interfaces/controllers/review/review-controller.interface";
import { CustomRequest } from "../../middlewares/auth.middleware";

@injectable()
export class ReviewController implements IReviewController {
  constructor(
    @inject("IAddReviewUsecase")
    private _addReviewUsecase: IAddReviewUsecase,

    @inject("IGetPackageReviewsUsecase")
    private _getPackageReviewUsecase: IGetPackageReviewsUsecase,

    @inject("IGetGuideReviewUsecase")
    private _getGuideReviewUsecase: IGetGuideReviewUsecase
  ) {}

  async addReview(req: Request, res: Response): Promise<void> {
    const userId = (req as CustomRequest).user.id;
    const { targetType, rating, comment, packageId, guideId } = req.body;
    await this._addReviewUsecase.execute(
      userId,
      targetType,
      rating,
      comment,
      packageId,
      guideId
    );
    ResponseHelper.success(
      res,
      HTTP_STATUS.CREATED,
      SUCCESS_MESSAGE.ADDED_REVIEW
    );
  }

  async getReviews(req: Request, res: Response): Promise<void> {
    const { packageId } = req.params;
    const { reviews, averageRating, totalReviews } =
      await this._getPackageReviewUsecase.execute(packageId);
    const responseData = {
      reviews,
      averageRating,
      totalReviews,
    };
    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.DETAILS_FETCHED,
      responseData
    );
  }

  async getGuideReviews(req: Request, res: Response): Promise<void> {
    const { guideId, packageId } = req.params;
     const { reviews, averageRating, totalReviews }  = await this._getGuideReviewUsecase.execute(
      packageId,
      guideId
    );
     const responseData = {
      reviews,
      averageRating,
      totalReviews,
    };
    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.DETAILS_FETCHED,
      responseData,
    );
  }
}
