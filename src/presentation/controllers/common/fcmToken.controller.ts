import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import { ISaveFcmTokenUsecase } from "../../../application/usecase/interfaces/fcmToken/saveFcmToken-usecase.interface";
import { ResponseHelper } from "../../../infrastructure/config/server/helpers/response.helper";
import { HTTP_STATUS, SUCCESS_MESSAGE } from "../../../shared/constants";
import { IFcmController } from "../../interfaces/controllers/fcmToken.controller";
import { CustomRequest } from "../../middlewares/auth.middleware";

@injectable()
export class FcmTokencontroller implements IFcmController {
  constructor(
    @inject("ISaveFcmTokenUsecase")
    private _saveFcmTokenUsecase: ISaveFcmTokenUsecase
  ) {}

  async saveFcmToken(req: Request, res: Response): Promise<void> {
    const userId = (req as CustomRequest).user.id;
    const { token } = req.body;
    await this._saveFcmTokenUsecase.execute(userId, token);
    ResponseHelper.success(
      res,
      HTTP_STATUS.CREATED,
      SUCCESS_MESSAGE.FCM_TOKEN_SAVED
    );
  }
}
