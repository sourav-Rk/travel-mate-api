import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import { IClientProfileController } from "../../interfaces/controllers/client/clientProfile-controller.interface";
import { IGetClientDetailsUsecase } from "../../../application/usecase/interfaces/client/getClientDetails-usecase.interface";
import { IUpdateClientPasswordUsecase } from "../../../application/usecase/interfaces/client/update-client-password-usecase.interface";
import { IUpdateClientDetailsUsecase } from "../../../application/usecase/interfaces/client/updateClientDetails-usecase.interface";
import { HTTP_STATUS, SUCCESS_MESSAGE } from "../../../shared/constants";
import { CustomRequest } from "../../middlewares/auth.middleware";

@injectable()
export class ClientProfileController implements IClientProfileController {
  constructor(
    @inject("IGetClientDetailsUsecase")
    private _getClientDetailsUsecase: IGetClientDetailsUsecase,

    @inject("IUpdateClientDetailsUsecase")
    private _updateClientDetailsUsecase: IUpdateClientDetailsUsecase,

    @inject("IUpdateClientPasswordUsecase")
    private _updateClientPasswordUsecase: IUpdateClientPasswordUsecase
  ) {}

  async getClientDetails(req: Request, res: Response): Promise<void> {
    const userId = (req as CustomRequest).user.id;
    const client = await this._getClientDetailsUsecase.execute(userId);
    res.status(HTTP_STATUS.OK).json({ success: true, client });
  }

  async updateClientProfile(req: Request, res: Response): Promise<void> {
    const userId = (req as CustomRequest).user.id;
    const data = req.body;
    await this._updateClientDetailsUsecase.execute(userId, data);
    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: SUCCESS_MESSAGE.PROFILE_UPDATED_SUCCESS,
    });
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
    res
      .status(HTTP_STATUS.OK)
      .json({ success: true, message: SUCCESS_MESSAGE.PASSWORD_CHANGED });
  }
}
