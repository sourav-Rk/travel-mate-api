import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import { IAddressController } from "../../interfaces/controllers/address/address-controller.interface";
import { IUpdateAddressUsecase } from "../../../application/usecase/interfaces/address/update-address-usecase.interface";
import { IAddAddressUsecase } from "../../../application/usecase/interfaces/auth/add-address-usecase.interface";
import { HTTP_STATUS } from "../../../shared/constants";
import { AddressDto } from "../../../application/dto/response/addressDto";
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
    res
      .status(HTTP_STATUS.OK)
      .json({ success: true, message: "Address Updated successfully" });
  }

  async addAddress(req: Request, res: Response): Promise<void> {
    const vendorId = (req as CustomRequest).user.id;
    const data = { ...req.body, userId: vendorId } as AddressDto;
    const response = await this._addAddressUsecase.execute(data);
    res.status(response.statusCode).json(response.content);
  }
}
