import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import { DASHBOARD_PERIOD } from "../../../application/dto/request/admin.dto";
import { IGetAdminSalesReportUsecase } from "../../../application/usecase/interfaces/admin/get-admin-sales-report-usecase.interface";
import { IGetAllUsersUsecase } from "../../../application/usecase/interfaces/admin/get-all-users-usecase.interface";
import { IGetDashboardStatsUsecase } from "../../../application/usecase/interfaces/admin/get-dashboard-stats-usecase.interface";
import { IGetUserByIdUsecase } from "../../../application/usecase/interfaces/admin/getUserById-usecase.interface";
import { IUpdateUserstatusUsecase } from "../../../application/usecase/interfaces/admin/update-user-status-usecase.interface";
import { IAdminUpdateVendorStatusUsecase } from "../../../application/usecase/interfaces/admin/update-vendor-usecase.interface";
import { ResponseHelper } from "../../../infrastructure/config/server/helpers/response.helper";
import { HTTP_STATUS, SUCCESS_MESSAGE } from "../../../shared/constants";
import { IAdminController } from "../../interfaces/controllers/admin/admin.controller.interface";

@injectable()
export class AdminController implements IAdminController {
  constructor(
    @inject("IGetAllUsersUsecase")
    private _getAllUsersUsecase: IGetAllUsersUsecase,

    @inject("IUpdateUserstatusUsecase")
    private _updateUserStatusUsecase: IUpdateUserstatusUsecase,

    @inject("IGetUserByIdUsecase")
    private _getUserByIdUsecase: IGetUserByIdUsecase,

    @inject("IAdminUpdateVendorStatusUsecase")
    private _adminUpdateVendorStatusUsecase: IAdminUpdateVendorStatusUsecase,

    @inject("IGetDashboardStatsUsecase")
    private _getDashboardStatsUsecase: IGetDashboardStatsUsecase,

    @inject("IGetAdminSalesReportUsecase")
    private _getAdminSalesReportUsecase: IGetAdminSalesReportUsecase
  ) {}

  async getAllUsers(req: Request, res: Response): Promise<void> {
    const { page = 1, limit = 10, userType, searchTerm, status } = req.query;
    const pageNumber = Number(page);
    const pageSize = Number(limit);
    const userTypeString = typeof userType === "string" ? userType : "client";

    const { user, total } = await this._getAllUsersUsecase.execute(
      userTypeString,
      pageNumber,
      pageSize,
      searchTerm as string,
      status as string
    );

    ResponseHelper.paginated(
      res,
      user,
      total,
      pageNumber,
      SUCCESS_MESSAGE.DETAILS_FETCHED,
      "users"
    );
  }

  async updateUserStatus(req: Request, res: Response): Promise<void> {
    const { userType, userId } = req.query as { userType: string; userId: string };
    const response = await this._updateUserStatusUsecase.execute(
      userType,
      userId
    );

    ResponseHelper.success(res, response.statusCode, response.content.message);
  }

  async getUserDetails(req: Request, res: Response): Promise<void> {
    const { userType, userId } = req.query as {
      userType: string;
      userId: string;
    };
    const user = await this._getUserByIdUsecase.execute(userType, userId);
    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.DETAILS_FETCHED,
      user,
      "user"
    );
  }

  async updateVendorStatus(req: Request, res: Response): Promise<void> {
    const { vendorId, status, reason } = req.query as {
      vendorId: string;
      status: string;
      reason?: string;
    };

    await this._adminUpdateVendorStatusUsecase.execute(
      vendorId,
      status,
      reason
    );

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.STATUS_UPDATED_SUCCESS
    );
  }

  async getDashboardStats(req: Request, res: Response): Promise<void> {
    const { period, startDate, endDate } = req.query as {
      period?: string;
      startDate?: string;
      endDate?: string;
    };

    const dashboardPeriod = (period as DASHBOARD_PERIOD) || DASHBOARD_PERIOD.MONTHLY;

    const stats = await this._getDashboardStatsUsecase.execute(
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

  async getSalesReport(req: Request, res: Response): Promise<void> {
    const { period, startDate, endDate, vendorId, packageId } = req.query as {
      period?: string;
      startDate?: string;
      endDate?: string;
      vendorId?: string;
      packageId?: string;
    };

    const salesReport = await this._getAdminSalesReportUsecase.execute(
      (period as DASHBOARD_PERIOD) || DASHBOARD_PERIOD.MONTHLY,
      startDate,
      endDate,
      vendorId,
      packageId
    );

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.SUCCESS,
      salesReport,
      "salesReport"
    );
  }
}
