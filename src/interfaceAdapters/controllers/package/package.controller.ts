import { inject, injectable } from "tsyringe";
import { IPackageController } from "../../../entities/controllerInterfaces/package/package.controller.interface";
import { Request, Response } from "express";
import { CustomRequest } from "../../middlewares/auth.middleware";
import { IAddPackageUsecase } from "../../../entities/useCaseInterfaces/package/addPackage-usecase.interface";
import {
  ERROR_MESSAGE,
  HTTP_STATUS,
  SUCCESS_MESSAGE,
} from "../../../shared/constants";
import {
  ItineraryDto,
  PackageBasicDetailsDto,
} from "../../../shared/dto/packageDto";
import { basicDetailsSchema, packageFormSchema } from "../../../shared/validations/package.validation";
import { IGetPackagesUsecase } from "../../../entities/useCaseInterfaces/package/getPackages-usecase.interface";
import { IGetPackageDetailsUsecase } from "../../../entities/useCaseInterfaces/package/getPackageDetails-usecase.interface";
import { IUpdatePackageBasicDetailsUsecase } from "../../../entities/useCaseInterfaces/package/updatePackageBasicdetails-usecase.interface";
import { basicDetailsSchemaEdit } from "../../../shared/validations/editPackageValidation";

@injectable()
export class PackageController implements IPackageController {
  constructor(
    @inject("IAddPackageUsecase")
    private _addPackageUsecase: IAddPackageUsecase,

    @inject("IGetPackagesUsecase")
    private _getPackagesUsecase: IGetPackagesUsecase,

    @inject('IGetPackageDetailsUsecase')
    private _getPackageDetailsUsecase : IGetPackageDetailsUsecase,

    @inject('IUpdatePackageBasicDetailsUsecase')
    private _updatePackageBasicDetailsUsecase : IUpdatePackageBasicDetailsUsecase
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

    await this._addPackageUsecase.execute(basicDetails, itinerary);
    res
      .status(HTTP_STATUS.CREATED)
      .json({ success: true, message: SUCCESS_MESSAGE.PACKAGE_ADDED });
  }

  async getPackages(req: Request, res: Response): Promise<void> {
    const agencyId = (req as CustomRequest).user.id;
    const { page = 1, limit = 5, searchTerm, status, category } = req.query;
    const pageNumber = Number(page);
    const pageSize = Number(limit);
    const { packages, total } = await this._getPackagesUsecase.execute(
      agencyId,
      searchTerm as string,
      status as string,
      category as string,
      pageNumber,
      pageSize
    );
    res
      .status(HTTP_STATUS.OK)
      .json({ success: true, packages, totalPages : total, currentPage: pageNumber });
  }

  async getPackageDetails(req: Request, res: Response): Promise<void> {
      const agencyId = (req as CustomRequest).user.id;
      const {id} = req.params;
      const response = await this._getPackageDetailsUsecase.execute(agencyId,id as string);
      res.status(HTTP_STATUS.OK).json({success : true,packages : response})
  }

  async updatePackage(req: Request, res: Response): Promise<void> {
      const agencyId = (req as CustomRequest).user.id;
      console.log(req.body,"-->edit")
      const parsedResult = basicDetailsSchemaEdit.safeParse(req.body);
       if (!parsedResult.success) {
      console.log(parsedResult.error.format());
      res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ success: false, message: ERROR_MESSAGE.VALIDATION_FAILED });
      return;
    }
      const {id} = req.params;
      const basicDetails = req.body;
      await this._updatePackageBasicDetailsUsecase.execute(agencyId,id,basicDetails);
      res.status(HTTP_STATUS.OK).json({success : true,message : SUCCESS_MESSAGE.PACKAGE_UPDATED});
      
  }

}
