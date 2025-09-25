import { inject, injectable } from "tsyringe";
import { IReviewController } from "../../../entities/controllerInterfaces/review/review-controller.interface";
import { IAddReviewUsecase } from "../../../entities/useCaseInterfaces/review/add-review-usecase.interface";
import { Request, Response } from "express";
import { CustomRequest } from "../../middlewares/auth.middleware";
import { HTTP_STATUS, SUCCESS_MESSAGE } from "../../../shared/constants";
import { IGetPackageReviewsUsecase } from "../../../entities/useCaseInterfaces/review/getPackageReviews-usecase.interface";
import { IGetGuideReviewUsecase } from "../../../entities/useCaseInterfaces/review/get-guide-reviews.usecase";

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
    res
      .status(HTTP_STATUS.CREATED)
      .json({ success: true, message: SUCCESS_MESSAGE.ADDED_REVIEW });
  }

  async getReviews(req: Request, res: Response): Promise<void> {
    const { packageId } = req.params;
    const reviews = await this._getPackageReviewUsecase.execute(packageId);
    res.status(HTTP_STATUS.OK).json({ success: true, reviews });
  }

  async getGuideReviews(req: Request, res: Response): Promise<void> {
    const { guideId, packageId } = req.params;
    const reviews = await this._getGuideReviewUsecase.execute(
      packageId,
      guideId
    );
    res.status(HTTP_STATUS.OK).json({ success: true, reviews });
  }
}
