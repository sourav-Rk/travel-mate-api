import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import { IGetClientDetailsVendorUsecase } from "../../../application/usecase/interfaces/client/get-client-details-vendor-usecase.interface";
import { IGetClientDetailsUsecase } from "../../../application/usecase/interfaces/client/getClientDetails-usecase.interface";
import { IUpdateClientPasswordUsecase } from "../../../application/usecase/interfaces/client/update-client-password-usecase.interface";
import { IUpdateClientDetailsUsecase } from "../../../application/usecase/interfaces/client/updateClientDetails-usecase.interface";
import { ResponseHelper } from "../../../infrastructure/config/server/helpers/response.helper";
import { HTTP_STATUS, SUCCESS_MESSAGE } from "../../../shared/constants";
import { IClientProfileController } from "../../interfaces/controllers/client/clientProfile-controller.interface";
import { CustomRequest } from "../../middlewares/auth.middleware";

@injectable()
export class ClientProfileController implements IClientProfileController {
  constructor(
    @inject("IGetClientDetailsUsecase")
    private _getClientDetailsUsecase: IGetClientDetailsUsecase,

    @inject("IUpdateClientDetailsUsecase")
    private _updateClientDetailsUsecase: IUpdateClientDetailsUsecase,

    @inject("IUpdateClientPasswordUsecase")
    private _updateClientPasswordUsecase: IUpdateClientPasswordUsecase,

    @inject("IGetClientDetailsVendorUsecase")
    private _getClientDeatailsVendorUsecase: IGetClientDetailsVendorUsecase
  ) {}

  async getClientDetails(req: Request, res: Response): Promise<void> {
    const userId = (req as CustomRequest).user.id;
    const client = await this._getClientDetailsUsecase.execute(userId);
    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.DETAILS_FETCHED,
      client,
      "client"
    );
  }

  async updateClientProfile(req: Request, res: Response): Promise<void> {
    const userId = (req as CustomRequest).user.id;
    const data = req.body;
    await this._updateClientDetailsUsecase.execute(userId, data);
    ResponseHelper.success(
      res,
      HTTP_STATUS.CREATED,
      SUCCESS_MESSAGE.PROFILE_UPDATED_SUCCESS
    );
  }

  async updatePassword(req: Request, res: Response): Promise<void> {
    const clientId = (req as CustomRequest).user.id;
    const { currentPassword, newPassword } = req.body as {
      currentPassword: string;
      newPassword: string;
    };
    await this._updateClientPasswordUsecase.execute(
      clientId,
      currentPassword,
      newPassword
    );
    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.PASSWORD_CHANGED
    );
  }

  async getClientDetailsVendor(req: Request, res: Response): Promise<void> {
    const { clientId } = req.params;
    const data = await this._getClientDeatailsVendorUsecase.execute(clientId);
    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.DETAILS_FETCHED,
      data
    );
  }
}
