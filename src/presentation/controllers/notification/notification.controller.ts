import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import { IGetNotificationsUsecase } from "../../../application/usecase/interfaces/notification/get-notifications-usecase.interface";
import { IMarkAsAllReadUsecase } from "../../../application/usecase/interfaces/notification/mark-as-read-all-usecase.interface";
import { IMarkReadNotificationUsecase } from "../../../application/usecase/interfaces/notification/mark-read-notification-usecase.interface";
import { ResponseHelper } from "../../../infrastructure/config/server/helpers/response.helper";
import { HTTP_STATUS, SUCCESS_MESSAGE } from "../../../shared/constants";
import { INotificationController } from "../../interfaces/controllers/notification/notification-controller.interface";
import { CustomRequest } from "../../middlewares/auth.middleware";

@injectable()
export class NotificationController implements INotificationController {
  constructor(
    @inject("IGetNotificationsUsecase")
    private _getNotificationsUsecase: IGetNotificationsUsecase,

    @inject("IMarkReadNotificationUsecase")
    private _markAsReadNotificationUsecase: IMarkReadNotificationUsecase,

    @inject("IMarkAsAllReadUsecase")
    private _markAsAllReadNotificationUsecase: IMarkAsAllReadUsecase
  ) {}

  async getNotifications(req: Request, res: Response): Promise<void> {
    const userId = (req as CustomRequest).user.id;
    const notifications = await this._getNotificationsUsecase.execute(userId);
    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.DETAILS_FETCHED,
      notifications,
      "notifications"
    );
  }

  async markReadNotification(req: Request, res: Response): Promise<void> {
    const { notificationId } = req.params;
    await this._markAsReadNotificationUsecase.execute(notificationId);
    ResponseHelper.success(res, HTTP_STATUS.OK, SUCCESS_MESSAGE.MARK_AS_READ);
  }

  async markAsReadAllNotification(req: Request, res: Response): Promise<void> {
    const userId = (req as CustomRequest).user.id;
    await this._markAsAllReadNotificationUsecase.execute(userId);
    ResponseHelper.success(res, HTTP_STATUS.OK, SUCCESS_MESSAGE.ALL_MARK_READ);
  }
}
