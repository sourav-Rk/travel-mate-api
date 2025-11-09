import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import { IGetVendorDetailsForStatusUsecase } from "../../../application/usecase/interfaces/vendor/get-vendor-details.usecase.interface";
import { IUpdateVendorStatusUsecase } from "../../../application/usecase/interfaces/vendor/update-vendor-status.usecase.interface";
import { ResponseHelper } from "../../../infrastructure/config/server/helpers/response.helper";
import { HTTP_STATUS, SUCCESS_MESSAGE } from "../../../shared/constants";
import { IVendorController } from "../../interfaces/controllers/vendor/vendor.controller.interface";
import { CustomRequest } from "../../middlewares/auth.middleware";
import { IGetVendorDashboardStatsUsecase } from "../../../application/usecase/interfaces/vendor/get-vendor-dashboard-stats-usecase.interface";
import { VENDOR_DASHBOARD_PERIOD } from "../../../application/dto/request/vendor-dashboard.dto";

@injectable()
export class VendorController implements IVendorController {
  constructor(
    @inject("IGetVendorDetailsForStatusUsecase")
    private getVendorDetailsForStatusUsecase: IGetVendorDetailsForStatusUsecase,

    @inject("IUpdateVendorStatusUsecase")
    private updateVendorStatusUsecase: IUpdateVendorStatusUsecase,

    @inject("IGetVendorDashboardStatsUsecase")
    private _getVendorDashboardStatsUsecase: IGetVendorDashboardStatsUsecase
  ) {}

  async getDetailsforStatus(req: Request, res: Response): Promise<void> {
    const vendorId = (req as CustomRequest).user.id;
    const vendor = await this.getVendorDetailsForStatusUsecase.execute(
      vendorId
    );
    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.DETAILS_FETCHED,
      vendor,
      "vendor"
    );
  }

  async updateVendorStatus(req: Request, res: Response): Promise<void> {
    const vendorId = (req as CustomRequest).user.id;
    const { status } = req.body as {
      status: string;
    };

    await this.updateVendorStatusUsecase.execute(vendorId, status);
    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.STATUS_TO_REVIEWING
    );
  }

  async getDashboardStats(req: Request, res: Response): Promise<void> {
    const vendorId = (req as CustomRequest).user.id;
    const { period, startDate, endDate } = req.query as {
      period?: string;
      startDate?: string;
      endDate?: string;
    };

    const dashboardPeriod = (period as VENDOR_DASHBOARD_PERIOD) || "monthly";

    const stats = await this._getVendorDashboardStatsUsecase.execute(
      vendorId,
      dashboardPeriod,
      startDate,
      endDate
    );

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.DETAILS_FETCHED,
      stats,
      "dashboardStats"
    );
  }
}
