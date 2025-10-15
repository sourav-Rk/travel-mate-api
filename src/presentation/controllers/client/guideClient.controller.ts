import { inject, injectable } from "tsyringe";
import { IGetClientDetailsUsecase } from "../../../application/usecase/interfaces/client/getClientDetails-usecase.interface";
import { IGuideClientController } from "../../interfaces/controllers/client/guideClient-controller.interface";
import { Request, Response } from "express";
import { ResponseHelper } from "../../../infrastructure/config/server/helpers/response.helper";
import { HTTP_STATUS, SUCCESS_MESSAGE } from "../../../shared/constants";

@injectable()
export class GuideClientController implements IGuideClientController{
    constructor(
        @inject('IGetClientDetailsUsecase')
        private _getClientDetailsUsecase : IGetClientDetailsUsecase
    ){}

    async getClientDetailsForGuide(req: Request, res: Response): Promise<void> {
        const {clientId} = req.params;
        const data = await this._getClientDetailsUsecase.execute(clientId);
        ResponseHelper.success(res,HTTP_STATUS.OK,SUCCESS_MESSAGE.DETAILS_FETCHED,data,"client")
    } 
}