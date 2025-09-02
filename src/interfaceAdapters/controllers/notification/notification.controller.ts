import { inject, injectable } from "tsyringe";
import { INotificationController } from "../../../entities/controllerInterfaces/notification/notification-controller.interface";
import { IGetNotificationsUsecase } from "../../../entities/useCaseInterfaces/notification/get-notifications-usecase.interface";
import { Request, Response } from "express";
import { CustomRequest } from "../../middlewares/auth.middleware";
import { HTTP_STATUS, SUCCESS_MESSAGE } from "../../../shared/constants";
import { IMarkReadNotificationUsecase } from "../../../entities/useCaseInterfaces/notification/mark-read-notification-usecase.interface";
import { IMarkAsAllReadUsecase } from "../../../entities/useCaseInterfaces/notification/mark-as-read-all-usecase.interface";

@injectable()
export class NotificationController implements INotificationController {
  constructor(
    @inject("IGetNotificationsUsecase")
    private _getNotificationsUsecase: IGetNotificationsUsecase,

    @inject("IMarkReadNotificationUsecase")
    private _markAsReadNotificationUsecase: IMarkReadNotificationUsecase,

    @inject('IMarkAsAllReadUsecase')
    private _markAsAllReadNotificationUsecase : IMarkAsAllReadUsecase
  ) {}

  async getNotifications(req: Request, res: Response): Promise<void> {
    const userId = (req as CustomRequest).user.id;
    const notifications = await this._getNotificationsUsecase.execute(userId);
    res.status(HTTP_STATUS.OK).json({ success: true, notifications });
  }

  async markReadNotification(req: Request, res: Response): Promise<void> {
    const { notificationId } = req.params;
    await this._markAsReadNotificationUsecase.execute(notificationId);
    res
      .status(HTTP_STATUS.OK)
      .json({ success: true, message: SUCCESS_MESSAGE.MARK_AS_READ });
  }

  async markAsReadAllNotification(req: Request, res: Response): Promise<void> {
      const userId = (req as CustomRequest).user.id;
      await this._markAsAllReadNotificationUsecase.execute(userId);
      res.status(HTTP_STATUS.OK).json({success : true,message : SUCCESS_MESSAGE.ALL_MARK_READ});
  }
}
