import { inject, injectable } from "tsyringe";
import { IAddressController } from "../../../entities/controllerInterfaces/address/address-controller.interface";
import { Request, Response } from "express";
import { CustomRequest } from "../../middlewares/auth.middleware";
import { AddressDto } from "../../../shared/dto/addressDto";
import { IUpdateAddressUsecase } from "../../../entities/useCaseInterfaces/address/update-address-usecase.interface";
import { HTTP_STATUS } from "../../../shared/constants";
import { IAddAddressUsecase } from "../../../entities/useCaseInterfaces/auth/add-address-usecase.interface";

@injectable()
export class AddressController implements IAddressController{
    constructor(
       @inject('IUpdateAddressUsecase')
       private _updateAddressUsecase : IUpdateAddressUsecase,

       @inject('IAddAddressUsecase')
       private _addAddressUsecase : IAddAddressUsecase
    ){}
    async updateAddress(req: Request, res: Response): Promise<void> {
        const id = (req as CustomRequest).user.id;
        const data = { ...req.body, userId: id } as AddressDto;
        await this._updateAddressUsecase.execute(id,data);
        res.status(HTTP_STATUS.OK).json({success : true,message : "Address Updated successfully"});
    }

      async addAddress(req: Request, res: Response): Promise<void> {
        const vendorId = (req as CustomRequest).user.id;
        const data = { ...req.body, userId: vendorId } as AddressDto;
        const response = await this._addAddressUsecase.execute(data);
        res.status(response.statusCode).json(response.content);
      }

}