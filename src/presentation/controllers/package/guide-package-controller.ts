import { inject, injectable } from "tsyringe";
import { IAssignedTripsUsecase } from "../../../application/usecase/interfaces/guideTrips/assignedTrips-usecase.interface";
import { Request, Response } from "express";
import { IGuidePackageController } from "../../interfaces/controllers/package/guide-package-controller.interface";
import { CustomRequest } from "../../middlewares/auth.middleware";
import { HTTP_STATUS } from "../../../shared/constants";
import { IViewPackageDetailsUsecase } from "../../../application/usecase/interfaces/guideTrips/viewPackageDetails-usecase.interface";
import { IUpdatePackageStatusUsecaseGuide } from "../../../application/usecase/interfaces/guideTrips/update-package-status-usecase.interface";

@injectable()
export class GuidePackageController implements IGuidePackageController {
  constructor(
    @inject("IAssignedTripsUsecase")
    private _assignedTripUsecase: IAssignedTripsUsecase,

    @inject("IViewPackageDetailsUsecase")
    private _viewPackageDetails: IViewPackageDetailsUsecase,

    @inject("IUpdatePackageStatusUsecaseGuide")
    private _updatePackageStatusUsecaseGuide: IUpdatePackageStatusUsecaseGuide
  ) {}

  async getAssignedPackages(req: Request, res: Response): Promise<void> {
    const guideID = (req as CustomRequest).user.id;

    const { searchTerm, status, page, limit } = req.query;

    console.log(req.query);

    const pageNumber = Number(page);
    const pageSize = Number(limit);

    const { packages, total } = await this._assignedTripUsecase.execute(
      guideID,
      searchTerm as string,
      status as string,
      pageNumber,
      pageSize
    );

    res.status(HTTP_STATUS.OK).json({
      success: true,
      packages,
      totalPages: total,
      currentPage: pageNumber,
    });
  }

  async getPackageDetails(req: Request, res: Response): Promise<void> {
    const { packageId } = req.params;
    const packages = await this._viewPackageDetails.execute(packageId);
    res.status(HTTP_STATUS.OK).json({ success: true, packages });
  }

  async updatePackageStatus(req: Request, res: Response): Promise<void> {
    const guideId = (req as CustomRequest).user.id;
    const { status, packageId } = req.body;
    await this._updatePackageStatusUsecaseGuide.execute(
      guideId,
      packageId,
      status
    );
  }
}
