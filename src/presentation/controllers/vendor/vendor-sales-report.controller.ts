import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import { IGetVendorSalesReportUsecase } from "../../../application/usecase/interfaces/vendor/get-vendor-sales-report-usecase.interface";
import { ResponseHelper } from "../../../infrastructure/config/server/helpers/response.helper";
import { HTTP_STATUS, SUCCESS_MESSAGE } from "../../../shared/constants";
import { IVendorSalesReportController } from "../../interfaces/controllers/vendor/vendor-sales-report-controller.interface";
import { CustomRequest } from "../../middlewares/auth.middleware";
import { VENDOR_SALES_REPORT_PERIOD } from "../../../application/dto/request/vendor-sales-report.dto";

@injectable()
export class VendorSalesReportController implements IVendorSalesReportController {
  constructor(
    @inject("IGetVendorSalesReportUsecase")
    private _getVendorSalesReportUsecase: IGetVendorSalesReportUsecase
  ) {}

  async getSalesReport(req: Request, res: Response): Promise<void> {
    const vendorId = (req as CustomRequest).user.id;
    const { period, startDate, endDate, packageId, bookingStatus, paymentMode } = req.query as {
      period?: string;
      startDate?: string;
      endDate?: string;
      packageId?: string;
      bookingStatus?: string;
      paymentMode?: string;
    };

    const reportPeriod = (period as VENDOR_SALES_REPORT_PERIOD) || "monthly";

    const salesReport = await this._getVendorSalesReportUsecase.execute(
      vendorId,
      reportPeriod,
      startDate,
      endDate,
      packageId,
      bookingStatus,
    );

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.DETAILS_FETCHED,
      salesReport,
      "salesReport"
    );
  }
}
















