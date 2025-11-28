import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import { IAssignedTripsUsecase } from "../../../application/usecase/interfaces/guideTrips/assignedTrips-usecase.interface";
import { IGetMyGuideReviewsUsecase } from "../../../application/usecase/interfaces/review/get-my-guide-reviews.usecase.interface";
import { IUpdatePackageStatusUsecaseGuide } from "../../../application/usecase/interfaces/guideTrips/update-package-status-usecase.interface";
import { IViewPackageDetailsUsecase } from "../../../application/usecase/interfaces/guideTrips/viewPackageDetails-usecase.interface";
import { ResponseHelper } from "../../../infrastructure/config/server/helpers/response.helper";
import { HTTP_STATUS, SUCCESS_MESSAGE } from "../../../shared/constants";
import { IGuidePackageController } from "../../interfaces/controllers/package/guide-package-controller.interface";
import { CustomRequest } from "../../middlewares/auth.middleware";

@injectable()
export class GuidePackageController implements IGuidePackageController {
  constructor(
    @inject("IAssignedTripsUsecase")
    private _assignedTripUsecase: IAssignedTripsUsecase,

    @inject("IViewPackageDetailsUsecase")
    private _viewPackageDetails: IViewPackageDetailsUsecase,

    @inject("IUpdatePackageStatusUsecaseGuide")
    private _updatePackageStatusUsecaseGuide: IUpdatePackageStatusUsecaseGuide,

    @inject("IGetMyGuideReviewsUsecase")
    private _getMyGuideReviewsUsecase: IGetMyGuideReviewsUsecase
  ) {}

  async getAssignedPackages(req: Request, res: Response): Promise<void> {
    const guideID = (req as CustomRequest).user.id;

    const { searchTerm, status, page, limit } = req.query;

    const pageNumber = Number(page);
    const pageSize = Number(limit);

    const { packages, total } = await this._assignedTripUsecase.execute(
      guideID,
      searchTerm as string,
      status as string,
      pageNumber,
      pageSize
    );

    ResponseHelper.paginated(
      res,
      packages,
      total,
      pageNumber,
      SUCCESS_MESSAGE.DETAILS_FETCHED,
      "packages"
    );
  }

  async getPackageDetails(req: Request, res: Response): Promise<void> {
    const { packageId } = req.params;
    const packages = await this._viewPackageDetails.execute(packageId);
    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.DETAILS_FETCHED,
      packages,
      "packages"
    );
  }

  async updatePackageStatus(req: Request, res: Response): Promise<void> {
    const guideId = (req as CustomRequest).user.id;
    const { status, packageId } = req.body;
    await this._updatePackageStatusUsecaseGuide.execute(
      guideId,
      packageId,
      status
    );
    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.STATUS_UPDATED_SUCCESS
    );
  }

  async getMyReviews(req: Request, res: Response): Promise<void> {
    const guideId = (req as CustomRequest).user.id;
    const responseData = await this._getMyGuideReviewsUsecase.execute(guideId);
    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.DETAILS_FETCHED,
      responseData
    );
  }
}
