import { inject, injectable } from "tsyringe";
import { IVendorProfileController } from "../../../entities/controllerInterfaces/vendor/vendor-profile.controller.interface";
import { CustomRequest } from "../../middlewares/auth.middleware";
import { Request, Response } from "express";
import { IGetVendorDetailsUsecase } from "../../../entities/useCaseInterfaces/vendor/get-vendor-details-usecase.interface";
import { HTTP_STATUS, SUCCESS_MESSAGE } from "../../../shared/constants";
import { IUpdateVendorPasswordUsecase } from "../../../entities/useCaseInterfaces/vendor/update-vendor-password-usecase.interface";

@injectable()
export class VendorProfileController implements IVendorProfileController {
  constructor(
    @inject("IGetVendorDetailsUsecase")
    private _getVendorDetailsUsecase: IGetVendorDetailsUsecase,

    @inject("IUpdateVendorPasswordUsecase")
    private _updateVendorPasswordUsecase: IUpdateVendorPasswordUsecase
  ) {}

  async getVendorDetails(req: Request, res: Response): Promise<void> {
    const vendorId = (req as CustomRequest).user.id;
    const vendor = await this._getVendorDetailsUsecase.execute(vendorId);
    res
      .status(HTTP_STATUS.OK)
      .json({ success: true, message: "fetched", vendor });
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
    res
      .status(HTTP_STATUS.OK)
      .json({ success: true, message: SUCCESS_MESSAGE.PASSWORD_CHANGED });
  }
}
