import { inject, injectable } from "tsyringe";
import { IActivityController } from "../../../entities/controllerInterfaces/activity/activity-controller.interface";
import { ICreateActivityUsecase } from "../../../entities/useCaseInterfaces/activity/createActivity-usecase.interface";
import { Request, Response } from "express";
import { HTTP_STATUS, SUCCESS_MESSAGE } from "../../../shared/constants";
import { IUpdateActivityUsecase } from "../../../entities/useCaseInterfaces/activity/updateActivity-usecase.interface";
import { IDeleteActivityUsecase } from "../../../entities/useCaseInterfaces/activity/deleteActivity-usecase.interface";

@injectable()
export class ActivityController implements IActivityController{
    constructor(
        @inject('ICreateActivityUsecase')
        private _createActivityUsecase : ICreateActivityUsecase,

        @inject('IUpdateActivityUsecase')
        private _updateActivityUsecase : IUpdateActivityUsecase,

        @inject('IDeleteActivityUsecase')
        private _deleteActivityUsecase : IDeleteActivityUsecase
    ){}

    async createActivity(req: Request, res: Response): Promise<void> {
        const {itineraryId,dayNumber,activityData} = req.body;
        await this._createActivityUsecase.execute(itineraryId,dayNumber,activityData);
        res.status(HTTP_STATUS.CREATED).json({success : true,message : SUCCESS_MESSAGE.ACTIVITY_ADDED});
    }

    async updateActivity(req: Request, res: Response): Promise<void> {
        const {activityId} = req.params;
        const activityData = req.body;
        await this._updateActivityUsecase.execute(activityId,activityData);
        res.status(HTTP_STATUS.OK).json({success : true,message : SUCCESS_MESSAGE.ACTIVITY_UPDATED});
    }

    async deleteActivity(req: Request, res: Response): Promise<void> {
        console.log(req.body);
        const {itineraryId,dayNumber,activityId} = req.body;
        await this._deleteActivityUsecase.execute(itineraryId,dayNumber,activityId);
        res.status(HTTP_STATUS.OK).json({success : true,message : SUCCESS_MESSAGE.ACTIVITY_DELETED});
    }
}