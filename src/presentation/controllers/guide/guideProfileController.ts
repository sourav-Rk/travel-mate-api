import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import { IGuideProfileController } from "../../interfaces/controllers/guide/guide-profile-controller.interface";
import { IGetGuideProfileUsecase } from "../../../application/usecase/interfaces/guide/getGuideProfile-usecase.interface";
import { IUpdateGuidePasswordUsecase } from "../../../application/usecase/interfaces/guide/updateGuidePassword-usecase.interface";
import { HTTP_STATUS, SUCCESS_MESSAGE } from "../../../shared/constants";
import { CustomRequest } from "../../middlewares/auth.middleware";
import { IGetGuideDetailsClientUsecase } from "../../../application/usecase/interfaces/guide/get-guide-details-client-usecase.interface";

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
    res.status(HTTP_STATUS.OK).json({ success: true, guide });
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
    res
      .status(HTTP_STATUS.OK)
      .json({ success: true, message: SUCCESS_MESSAGE.PASSWORD_CHANGED });
  }

  async getGuideDetailsForClient(req: Request, res: Response): Promise<void> {
    const userId = (req as CustomRequest).user.id;
    const { guideId } = req.params;
    const guide = await this._getGuideDetailsClientUsecase.execute(
      userId,
      guideId
    );
    res.status(HTTP_STATUS.OK).json({ success: true, guide });
  }
}
