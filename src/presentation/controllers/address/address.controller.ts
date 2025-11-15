import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import { AddressDto } from "../../../application/dto/response/addressDto";
import { IUpdateAddressUsecase } from "../../../application/usecase/interfaces/address/update-address-usecase.interface";
import { IAddAddressUsecase } from "../../../application/usecase/interfaces/auth/add-address-usecase.interface";
import { ResponseHelper } from "../../../infrastructure/config/server/helpers/response.helper";
import { HTTP_STATUS, SUCCESS_MESSAGE } from "../../../shared/constants";
import { IAddressController } from "../../interfaces/controllers/address/address-controller.interface";
import { CustomRequest } from "../../middlewares/auth.middleware";

@injectable()
export class AddressController implements IAddressController {
  constructor(
    @inject("IUpdateAddressUsecase")
    private _updateAddressUsecase: IUpdateAddressUsecase,

    @inject("IAddAddressUsecase")
    private _addAddressUsecase: IAddAddressUsecase
  ) {}
  async updateAddress(req: Request, res: Response): Promise<void> {
    const id = (req as CustomRequest).user.id;
    const data = { ...req.body, userId: id } as AddressDto;
    await this._updateAddressUsecase.execute(id, data);

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.ADDRESS.ADDRESS_UPDATED
    );
  }

  async addAddress(req: Request, res: Response): Promise<void> {
    const vendorId = (req as CustomRequest).user.id;
    const data = { ...req.body, userId: vendorId } as AddressDto;
    const response = await this._addAddressUsecase.execute(data);
    ResponseHelper.success(res, response.statusCode, response.content.message);
  }
}
