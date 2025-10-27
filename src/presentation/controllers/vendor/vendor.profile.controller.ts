import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import { IGetVendorDetailsClientUsecase } from "../../../application/usecase/interfaces/vendor/get-vendor-details-client-usecase.interface";
import { IGetVendorDetailsUsecase } from "../../../application/usecase/interfaces/vendor/get-vendor-details-usecase.interface";
import { IUpdateVendorPasswordUsecase } from "../../../application/usecase/interfaces/vendor/update-vendor-password-usecase.interface";
import { IUpdateVendorProfileUsecase } from "../../../application/usecase/interfaces/vendor/update-vendor-profile-usecase.interface";
import { ResponseHelper } from "../../../infrastructure/config/server/helpers/response.helper";
import { HTTP_STATUS, SUCCESS_MESSAGE } from "../../../shared/constants";
import { IVendorProfileController } from "../../interfaces/controllers/vendor/vendor-profile.controller.interface";
import { CustomRequest } from "../../middlewares/auth.middleware";

@injectable()
export class VendorProfileController implements IVendorProfileController {
  constructor(
    @inject("IGetVendorDetailsUsecase")
    private _getVendorDetailsUsecase: IGetVendorDetailsUsecase,

    @inject("IUpdateVendorProfileUsecase")
    private _updateVendorProfileUsecase: IUpdateVendorProfileUsecase,

    @inject("IUpdateVendorPasswordUsecase")
    private _updateVendorPasswordUsecase: IUpdateVendorPasswordUsecase,

    @inject("IGetVendorDetailsClientUsecase")
    private _getVendorDetailsClientUsecase: IGetVendorDetailsClientUsecase
  ) {}

  async getVendorDetails(req: Request, res: Response): Promise<void> {
    const vendorId = (req as CustomRequest).user.id;
    const vendor = await this._getVendorDetailsUsecase.execute(vendorId);
    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.DETAILS_FETCHED,
      vendor,
      "vendor"
    );
  }

  async updateVendorProfile(req: Request, res: Response): Promise<void> {
    const vendorId = (req as CustomRequest).user.id;
    const data = req.body;
    await this._updateVendorProfileUsecase.execute(vendorId, data);
    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.PROFILE_UPDATED_SUCCESS
    );
  }

  async updatePassword(req: Request, res: Response): Promise<void> {
    const vendorId = (req as CustomRequest).user.id;
    const { currentPassword, newPassword } = req.body as {
      currentPassword: string;
      newPassword: string;
    };
    await this._updateVendorPasswordUsecase.execute(
      vendorId,
      currentPassword,
      newPassword
    );
    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.PASSWORD_CHANGED
    );
  }

  async getVendorDetailsClient(req: Request, res: Response): Promise<void> {
    const { vendorId } = req.params;
    const data = await this._getVendorDetailsClientUsecase.execute(vendorId);
    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.DETAILS_FETCHED,
      data
    );
  }
}
