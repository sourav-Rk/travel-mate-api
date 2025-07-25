import { inject, injectable } from "tsyringe";
import { IClientProfileController } from "../../../entities/controllerInterfaces/client/clientProfile-controller.interface";
import { Request, Response } from "express";
import { CustomRequest } from "../../middlewares/auth.middleware";
import { IGetClientDetailsUsecase } from "../../../entities/useCaseInterfaces/client/getClientDetails-usecase.interface";
import { HTTP_STATUS, SUCCESS_MESSAGE } from "../../../shared/constants";
import { IUpdateClientDetailsUsecase } from "../../../entities/useCaseInterfaces/client/updateClientDetails-usecase.interface";
import { IUpdateClientPasswordUsecase } from "../../../entities/useCaseInterfaces/client/update-client-password-usecase.interface";

@injectable()
export class ClientProfileController implements IClientProfileController{
    constructor(
        @inject('IGetClientDetailsUsecase')
        private _getClientDetailsUsecase : IGetClientDetailsUsecase,
        
        @inject('IUpdateClientDetailsUsecase')
        private _updateClientDetailsUsecase : IUpdateClientDetailsUsecase,

        @inject('IUpdateClientPasswordUsecase')
        private _updateClientPasswordUsecase : IUpdateClientPasswordUsecase
    ){}

    async getClientDetails(req: Request, res: Response): Promise<void> {
        const userId = (req as CustomRequest).user.id;
        const client = await this._getClientDetailsUsecase.execute(userId);
        res.status(HTTP_STATUS.OK).json({success : true,client});
    } 

   async updateClientProfile(req : Request,res : Response) : Promise<void>{
        const userId = (req as CustomRequest).user.id;
        const data  = req.body ;
        await this._updateClientDetailsUsecase.execute(userId,data);
        res.status(HTTP_STATUS.CREATED).json({success : true,message : SUCCESS_MESSAGE.PROFILE_UPDATED_SUCCESS})
    }

    async updatePassword(req : Request, res : Response) : Promise<void>{
        const clientId = (req as CustomRequest).user.id;
        const {currentPassword,newPassword} = req.body as {currentPassword : string; newPassword : string};
        await this._updateClientPasswordUsecase.execute(clientId,currentPassword,newPassword);
        res.status(HTTP_STATUS.OK).json({success : true,message : SUCCESS_MESSAGE.PASSWORD_CHANGED});
    }

}