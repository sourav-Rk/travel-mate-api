import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import { IPackageController } from "../../../entities/controllerInterfaces/package/package.controller.interface";
import { IAddPackageUsecase } from "../../../entities/useCaseInterfaces/package/addPackage-usecase.interface";
import { IGetPackageDetailsUsecase } from "../../../entities/useCaseInterfaces/package/getPackageDetails-usecase.interface";
import { IGetPackagesUsecase } from "../../../entities/useCaseInterfaces/package/getPackages-usecase.interface";
import { IUpdateBlockStatusUsecase } from "../../../entities/useCaseInterfaces/package/update-block-status-usecase.interface";
import { IUpdatePackageBasicDetailsUsecase } from "../../../entities/useCaseInterfaces/package/updatePackageBasicdetails-usecase.interface";
import { IUpdatePackageStatusUsecase } from "../../../entities/useCaseInterfaces/package/updatePackageStatus-usecase-interface";
import {
  ERROR_MESSAGE,
  HTTP_STATUS,
  PackageStatus,
  SUCCESS_MESSAGE,
  TRole,
} from "../../../shared/constants";
import {
  ItineraryDto,
  PackageBasicDetailsDto,
} from "../../../shared/dto/packageDto";
import { basicDetailsSchemaEdit } from "../../../shared/validations/editPackageValidation";
import { packageFormSchema } from "../../../shared/validations/package.validation";
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
    private _updateBlockStatus: IUpdateBlockStatusUsecase
  ) {}

  async addPackage(req: Request, res: Response): Promise<void> {
    const parsedResult = packageFormSchema.safeParse(req.body.data);
    if (!parsedResult.success) {
      console.log(parsedResult.error.format());
      res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ success: false, message: ERROR_MESSAGE.VALIDATION_FAILED });
      return;
    }
    const agencyId = (req as CustomRequest).user.id;
    const basicDetails = {
      ...req.body.data.basicDetails,
      agencyId: agencyId,
    } as PackageBasicDetailsDto;
    const itinerary = req.body.data.itinerary as ItineraryDto;

    console.log(req.body)

    await this._addPackageUsecase.execute(basicDetails, itinerary);
    res
      .status(HTTP_STATUS.CREATED)
      .json({ success: true, message: SUCCESS_MESSAGE.PACKAGE_ADDED });
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
    res.status(HTTP_STATUS.OK).json({
      success: true,
      packages,
      totalPages: total,
      currentPage: pageNumber,
    });
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

    res.status(HTTP_STATUS.OK).json({ success: true, packages: response });
  }

  async updatePackage(req: Request, res: Response): Promise<void> {
    const agencyId = (req as CustomRequest).user.id;
    const parsedResult = basicDetailsSchemaEdit.safeParse(req.body);
    if (!parsedResult.success) {
      console.log(parsedResult.error.format());
      res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ success: false, message: ERROR_MESSAGE.VALIDATION_FAILED });
      return;
    }
    const { id } = req.params;
    const basicDetails = req.body;
    await this._updatePackageBasicDetailsUsecase.execute(
      agencyId,
      id,
      basicDetails
    );
    res
      .status(HTTP_STATUS.OK)
      .json({ success: true, message: SUCCESS_MESSAGE.PACKAGE_UPDATED });
  }

  async updatePackageStatus(req: Request, res: Response): Promise<void> {
    const { packageId, status } = req.body;
    await this._updatePackageStatusUsecase.execute(
      packageId,
      status as PackageStatus
    );
    res
      .status(HTTP_STATUS.OK)
      .json({ success: true, message: SUCCESS_MESSAGE.STATUS_UPDATED_SUCCESS });
  }

  async updateBlockStatus(req: Request, res: Response): Promise<void> {
    const { packageId } = req.body;
    await this._updateBlockStatus.execute(packageId);
    res
      .status(HTTP_STATUS.OK)
      .json({ success: true, message: "Status updated successfully" });
  }
}
