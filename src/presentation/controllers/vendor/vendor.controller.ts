import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import { IVendorController } from "../../interfaces/controllers/vendor/vendor.controller.interface";
import { IGetVendorDetailsForStatusUsecase } from "../../../application/usecase/interfaces/vendor/get-vendor-details.usecase.interface";
import { IUpdateVendorStatusUsecase } from "../../../application/usecase/interfaces/vendor/update-vendor-status.usecase.interface";
import { HTTP_STATUS } from "../../../shared/constants";
import { CustomRequest } from "../../middlewares/auth.middleware";

@injectable()
export class VendorController implements IVendorController {
  constructor(
    @inject("IGetVendorDetailsForStatusUsecase")
    private getVendorDetailsForStatusUsecase: IGetVendorDetailsForStatusUsecase,

    @inject("IUpdateVendorStatusUsecase")
    private updateVendorStatusUsecase: IUpdateVendorStatusUsecase
  ) {}

  async getDetailsforStatus(req: Request, res: Response): Promise<void> {
    const vendorId = (req as CustomRequest).user.id;
    const vendor = await this.getVendorDetailsForStatusUsecase.execute(
      vendorId
    );
    res.status(HTTP_STATUS.OK).json({ success: true, vendor });
  }

  async updateVendorStatus(req: Request, res: Response): Promise<void> {
    const vendorId = (req as CustomRequest).user.id;
    const { status } = req.body as {
      status: string;
    };

    await this.updateVendorStatusUsecase.execute(vendorId, status);
    res
      .status(HTTP_STATUS.OK)
      .json({ success: true, message: "status updated to reviewing" });
  }
}
