import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import { KycDto } from "../../../application/dto/response/kycDto";
import { IAddKycUsecase } from "../../../application/usecase/interfaces/auth/add-kyc-usecase.interface";
import { ResponseHelper } from "../../../infrastructure/config/server/helpers/response.helper";
import { IKycController } from "../../interfaces/controllers/kyc/kycController.interface";
import { CustomRequest } from "../../middlewares/auth.middleware";

@injectable()
export class KycController implements IKycController {
  constructor(
    @inject("IAddKycUsecase")
    private _addKycUsecase: IAddKycUsecase
  ) {}

  async addKyc(req: Request, res: Response): Promise<void> {
    const vendorId = (req as CustomRequest).user.id;
    const data = { ...req.body, vendorId } as KycDto;
    const response = await this._addKycUsecase.execute(data);
    ResponseHelper.success(res, response.statusCode, response.content.message);
  }
}
