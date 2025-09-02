import { inject, injectable } from "tsyringe";
import { IFcmController } from "../../../entities/controllerInterfaces/fcmToken.controller";
import { Request, Response } from "express";
import { CustomRequest } from "../../middlewares/auth.middleware";
import { ISaveFcmTokenUsecase } from "../../../entities/useCaseInterfaces/fcmToken/saveFcmToken-usecase.interface";
import { HTTP_STATUS } from "../../../shared/constants";

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
    res
      .status(HTTP_STATUS.CREATED)
      .json({ success: true, message: "Fcm Token saved successfully" });
  }
}
