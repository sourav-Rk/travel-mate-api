import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import {
  ItineraryDto,
  PackageBasicDetailsDto,
} from "../../../application/dto/response/packageDto";
import { IAddPackageUsecase } from "../../../application/usecase/interfaces/package/addPackage-usecase.interface";
import { IAssignGuideToTripUsecase } from "../../../application/usecase/interfaces/package/assign-guide-to-trip-usecase.interface";
import { IGetPackageDetailsUsecase } from "../../../application/usecase/interfaces/package/getPackageDetails-usecase.interface";
import { IGetPackagesUsecase } from "../../../application/usecase/interfaces/package/getPackages-usecase.interface";
import { IUpdateBlockStatusUsecase } from "../../../application/usecase/interfaces/package/update-block-status-usecase.interface";
import { IUpdatePackageBasicDetailsUsecase } from "../../../application/usecase/interfaces/package/updatePackageBasicdetails-usecase.interface";
import { IUpdatePackageStatusUsecase } from "../../../application/usecase/interfaces/package/updatePackageStatus-usecase-interface";
import { ResponseHelper } from "../../../infrastructure/config/server/helpers/response.helper";
import {
  ERROR_MESSAGE,
  HTTP_STATUS,
  PackageStatus,
  SUCCESS_MESSAGE,
  TRole,
} from "../../../shared/constants";
import { basicDetailsSchemaEdit } from "../../../shared/validations/editPackageValidation";
import { packageFormSchema } from "../../../shared/validations/package.validation";
import { IPackageController } from "../../interfaces/controllers/package/package.controller.interface";
import { CustomRequest } from "../../middlewares/auth.middleware";

@injectable()
export class PackageController implements IPackageController {
  constructor(
    @inject("IAddPackageUsecase")
    private _addPackageUsecase: IAddPackageUsecase,

    @inject("IGetPackagesUsecase")
    private _getPackagesUsecase: IGetPackagesUsecase,

    @inject("IGetPackageDetailsUsecase")
    private _getPackageDetailsUsecase: IGetPackageDetailsUsecase,

    @inject("IUpdatePackageBasicDetailsUsecase")
    private _updatePackageBasicDetailsUsecase: IUpdatePackageBasicDetailsUsecase,

    @inject("IUpdatePackageStatusUsecase")
    private _updatePackageStatusUsecase: IUpdatePackageStatusUsecase,

    @inject("IUpdateBlockStatusUsecase")
    private _updateBlockStatus: IUpdateBlockStatusUsecase,

    @inject("IAssignGuideToTripUsecase")
    private _assignGuideToTripUsecase: IAssignGuideToTripUsecase
  ) {}

  async addPackage(req: Request, res: Response): Promise<void> {
    const parsedResult = packageFormSchema.safeParse(req.body.data);
    if (!parsedResult.success) {
      console.log(parsedResult.error.format());
      ResponseHelper.error(
        res,
        ERROR_MESSAGE.VALIDATION_FAILED,
        HTTP_STATUS.BAD_REQUEST
      );
      return;
    }
    const agencyId = (req as CustomRequest).user.id;
    const basicDetails = {
      ...req.body.data.basicDetails,
      agencyId: agencyId,
    } as PackageBasicDetailsDto;
    const itinerary = req.body.data.itinerary as ItineraryDto;

    await this._addPackageUsecase.execute(basicDetails, itinerary);
    ResponseHelper.success(
      res,
      HTTP_STATUS.CREATED,
      SUCCESS_MESSAGE.PACKAGE_ADDED
    );
  }

  async getPackages(req: Request, res: Response): Promise<void> {
    const userId = (req as CustomRequest).user.id;
    const {
      page = 1,
      limit = 5,
      searchTerm,
      status,
      category,
      userType,
    } = req.query;
    const pageNumber = Number(page);
    const pageSize = Number(limit);

    const role: TRole =
      typeof userType === "string" ? (userType as TRole) : "vendor";

    const { packages, total } = await this._getPackagesUsecase.execute(
      userId,
      searchTerm as string,
      status as string,
      category as string,
      pageNumber,
      pageSize,
      role
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
    const userId = (req as CustomRequest).user.id;
    const { userType } = req.query;
    const { id } = req.params;
    const role: TRole =
      typeof userType === "string" ? (userType as TRole) : "vendor";

    const response = await this._getPackageDetailsUsecase.execute(
      role,
      userId,
      id as string
    );

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.DETAILS_FETCHED,
      response,
      "packages"
    );
  }

  async updatePackage(req: Request, res: Response): Promise<void> {
    const agencyId = (req as CustomRequest).user.id;
    const parsedResult = basicDetailsSchemaEdit.safeParse(req.body);
    if (!parsedResult.success) {
      console.log(parsedResult.error.format());
      ResponseHelper.error(
        res,
        ERROR_MESSAGE.VALIDATION_FAILED,
        HTTP_STATUS.BAD_REQUEST
      );
      return;
    }
    const { id } = req.params;
    const basicDetails = req.body;
    await this._updatePackageBasicDetailsUsecase.execute(
      agencyId,
      id,
      basicDetails
    );
    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.PACKAGE_UPDATED
    );
  }

  async updatePackageStatus(req: Request, res: Response): Promise<void> {
    const { packageId, status } = req.body;
    await this._updatePackageStatusUsecase.execute(
      packageId,
      status as PackageStatus
    );

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.STATUS_UPDATED_SUCCESS
    );
  }

  async updateBlockStatus(req: Request, res: Response): Promise<void> {
    const { packageId } = req.body;
    await this._updateBlockStatus.execute(packageId);
    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.STATUS_UPDATED_SUCCESS
    );
  }

  async assignGuideToTrip(req: Request, res: Response): Promise<void> {
    const { packageId } = req.params;
    const { guideId } = req.body;

    await this._assignGuideToTripUsecase.execute(packageId, guideId);
    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.GUIDE_ASSIGNED_SUCCESSFULLY
    );
  }
}
