import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import { ICreateActivityUsecase } from "../../../application/usecase/interfaces/activity/createActivity-usecase.interface";
import { IDeleteActivityUsecase } from "../../../application/usecase/interfaces/activity/deleteActivity-usecase.interface";
import { IUpdateActivityUsecase } from "../../../application/usecase/interfaces/activity/updateActivity-usecase.interface";
import { ResponseHelper } from "../../../infrastructure/config/server/helpers/response.helper";
import { HTTP_STATUS, SUCCESS_MESSAGE } from "../../../shared/constants";
import { IActivityController } from "../../interfaces/controllers/activity/activity-controller.interface";

@injectable()
export class ActivityController implements IActivityController {
  constructor(
    @inject("ICreateActivityUsecase")
    private _createActivityUsecase: ICreateActivityUsecase,

    @inject("IUpdateActivityUsecase")
    private _updateActivityUsecase: IUpdateActivityUsecase,

    @inject("IDeleteActivityUsecase")
    private _deleteActivityUsecase: IDeleteActivityUsecase
  ) {}

  async createActivity(req: Request, res: Response): Promise<void> {
    const { itineraryId, dayNumber, activityData } = req.body;
    await this._createActivityUsecase.execute(
      itineraryId,
      dayNumber,
      activityData
    );
    ResponseHelper.success(
      res,
      HTTP_STATUS.CREATED,
      SUCCESS_MESSAGE.ACTIVITY_ADDED
    );
  }

  async updateActivity(req: Request, res: Response): Promise<void> {
    const { activityId } = req.params;
    const activityData = req.body;
    await this._updateActivityUsecase.execute(activityId, activityData);
    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.ACTIVITY_UPDATED
    );
  }

  async deleteActivity(req: Request, res: Response): Promise<void> {
    console.log(req.body);
    const { itineraryId, dayNumber, activityId } = req.body;
    await this._deleteActivityUsecase.execute(
      itineraryId,
      dayNumber,
      activityId
    );

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.ACTIVITY_DELETED
    );
  }
}
