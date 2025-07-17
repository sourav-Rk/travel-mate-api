import { inject, injectable } from "tsyringe";
import { IGuideController } from "../../../entities/controllerInterfaces/guide.controller.interface";
import { Request, Response } from "express";
import { IResetPasswordUsecase } from "../../../entities/useCaseInterfaces/guide/reset-password-usecase.interface";
import { HTTP_STATUS, SUCCESS_MESSAGE } from "../../../shared/constants";

@injectable()
export class GuideController implements IGuideController{
    constructor(
       @inject('IResetPasswordUsecase')
       private _resetPasswordResetUsecase : IResetPasswordUsecase
    ){}

    async resetPassword(req : Request, res : Response) : Promise<void>{
        const {id,password,token} = req.body;
        await this._resetPasswordResetUsecase.execute(id,password,token);
        res.status(HTTP_STATUS.OK).json({success : true,message : SUCCESS_MESSAGE.PASSWORD_UPDATE_GUIDE});
    }
}