import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import { IVendorController } from "../../../entities/controllerInterfaces/vendor/vendor.controller.interface";
import { IGetVendorDetailsForStatusUsecase } from "../../../entities/useCaseInterfaces/vendor/get-vendor-details.usecase.interface";
import { IUpdateVendorStatusUsecase } from "../../../entities/useCaseInterfaces/vendor/update-vendor-status.usecase.interface";
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
    const vendor = await this.getVendorDetailsForStatusUsecase.execute(vendorId);
    res.status(HTTP_STATUS.OK).json({ success: true, vendor });
  }

  async updateVendorStatus(req: Request, res: Response): Promise<void> {
    const vendorId = (req as CustomRequest).user.id;
    const { status } = req.body as {
      status: string;
    };
    console.log(req.body,"--p")
    await this.updateVendorStatusUsecase.execute(
      vendorId,
      status
    );
    res
      .status(HTTP_STATUS.OK)
      .json({ success: true, message: "status updated to reviewing" });
  }

}
