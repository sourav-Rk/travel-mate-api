import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import { IAdminController } from "../../../entities/controllerInterfaces/admin/admin.controller.interface";
import { IGetAllUsersUsecase } from "../../../entities/useCaseInterfaces/admin/get-all-users-usecase.interface";
import { IGetUserByIdUsecase } from "../../../entities/useCaseInterfaces/admin/getUserById-usecase.interface";
import { IUpdateUserstatusUsecase } from "../../../entities/useCaseInterfaces/admin/update-user-status-usecase.interface";
import { IAdminUpdateVendorStatusUsecase } from "../../../entities/useCaseInterfaces/admin/update-vendor-usecase.interface";
import { HTTP_STATUS } from "../../../shared/constants";

@injectable()
export class AdminController implements IAdminController {
  constructor(
    @inject("IGetAllUsersUsecase")
    private getAllUsersUsecase: IGetAllUsersUsecase,

    @inject("IUpdateUserstatusUsecase")
    private updateUserStatusUsecase: IUpdateUserstatusUsecase,

    @inject("IGetUserByIdUsecase")
    private _getUserByIdUsecase: IGetUserByIdUsecase,

    @inject("IAdminUpdateVendorStatusUsecase")
    private _adminUpdateVendorStatusUsecase: IAdminUpdateVendorStatusUsecase
  ) {}

  async getAllUsers(req: Request, res: Response): Promise<void> {
    const { page = 1, limit = 10, userType, searchTerm, status } = req.query;
    const pageNumber = Number(page);
    const pageSize = Number(limit);
    const userTypeString = typeof userType === "string" ? userType : "client";

    const { user, total } = await this.getAllUsersUsecase.execute(
      userTypeString,
      pageNumber,
      pageSize,
      searchTerm as string,
      status as string
    );

    res.status(HTTP_STATUS.OK).json({
      success: true,
      users: user,
      totalPages: total,
      currentPage: pageNumber,
    });
  }

  async updateUserStatus(req: Request, res: Response): Promise<void> {
    const { userType, userId } = req.query as { userType: string; userId: any };
    const response = await this.updateUserStatusUsecase.execute(
      userType,
      userId
    );
    console.log(response, "--------->");
    res.status(response.statusCode).json(response.content);
  }

  async getUserDetails(req: Request, res: Response): Promise<void> {
    const { userType, userId } = req.query as {
      userType: string;
      userId: string;
    };
    const user = await this._getUserByIdUsecase.execute(userType, userId);
    res.status(HTTP_STATUS.OK).json({ success: true, user });
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
    res
      .status(HTTP_STATUS.OK)
      .json({ success: true, message: "status updated successfully" });
  }
}
