import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import { IGetGuideDetailsClientUsecase } from "../../../application/usecase/interfaces/guide/get-guide-details-client-usecase.interface";
import { IGetGuideProfileUsecase } from "../../../application/usecase/interfaces/guide/getGuideProfile-usecase.interface";
import { IUpdateGuidePasswordUsecase } from "../../../application/usecase/interfaces/guide/updateGuidePassword-usecase.interface";
import { ResponseHelper } from "../../../infrastructure/config/server/helpers/response.helper";
import { HTTP_STATUS, SUCCESS_MESSAGE } from "../../../shared/constants";
import { IGuideProfileController } from "../../interfaces/controllers/guide/guide-profile-controller.interface";
import { CustomRequest } from "../../middlewares/auth.middleware";

@injectable()
export class GuideProfileController implements IGuideProfileController {
  constructor(
    @inject("IGetGuideProfileUsecase")
    private _getGuideProfileUsecase: IGetGuideProfileUsecase,

    @inject("IUpdateGuidePasswordUsecase")
    private _updateGuidePasswordUsecase: IUpdateGuidePasswordUsecase,

    @inject("IGetGuideDetailsClientUsecase")
    private _getGuideDetailsClientUsecase: IGetGuideDetailsClientUsecase
  ) {}

  async getGuideProfile(req: Request, res: Response): Promise<void> {
    const guideId = (req as CustomRequest).user.id;
    const guide = await this._getGuideProfileUsecase.execute(guideId);
    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.DETAILS_FETCHED,
      guide,
      "guide"
    );
  }

  async updatePassword(req: Request, res: Response): Promise<void> {
    const guideId = (req as CustomRequest).user.id;
    const { currentPassword, newPassword } = req.body as {
      currentPassword: string;
      newPassword: string;
    };

    await this._updateGuidePasswordUsecase.execute(
      guideId,
      currentPassword,
      newPassword
    );

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.PASSWORD_CHANGED
    );
  }

  async getGuideDetailsForClient(req: Request, res: Response): Promise<void> {
    const userId = (req as CustomRequest).user.id;
    const { guideId } = req.params;
    const guide = await this._getGuideDetailsClientUsecase.execute(
      userId,
      guideId
    );
    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.DETAILS_FETCHED,
      guide,
      "guide"
    );
  }
}
