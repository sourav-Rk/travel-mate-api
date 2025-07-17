import { inject, injectable } from "tsyringe";
import { IVendorController } from "../../../entities/controllerInterfaces/vendor.controller.interface";
import { IGetVendorDetailsUsecase } from "../../../entities/useCaseInterfaces/vendor/get-vendor-details.usecase.interface";
import { Request, Response } from "express";
import { CustomRequest } from "../../middlewares/auth.middleware";
import { HTTP_STATUS, SUCCESS_MESSAGE } from "../../../shared/constants";
import { IAddAddressUsecase } from "../../../entities/useCaseInterfaces/auth/add-address-usecase.interface";
import { AddressDto } from "../../../shared/dto/authDto";
import { KycDto } from "../../../shared/dto/kycDto";
import { IAddKycUsecase } from "../../../entities/useCaseInterfaces/auth/add-kyc-usecase.interface";
import { IUpdateVendorStatusUsecase } from "../../../entities/useCaseInterfaces/vendor/update-vendor-status.usecase.interface";
import { UserDto } from "../../../shared/dto/user.dto";
import { IAddGuideUsecase } from "../../../entities/useCaseInterfaces/vendor/add-guide-usecase.interface";

@injectable()
export class VendorController implements IVendorController {
  constructor(
   
    @inject('IAddGuideUsecase')
    private _addGuideUsecase : IAddGuideUsecase,

    @inject("IGetVendorDetailsUsecase")
    private getVendorDetailsUsecase: IGetVendorDetailsUsecase,

    @inject("IAddAddressUsecase")
    private addAddressUsecase: IAddAddressUsecase,

    @inject("IAddKycUsecase")
    private addKycUsecase: IAddKycUsecase,

    @inject("IUpdateVendorStatusUsecase")
    private updateVendorStatusUsecase: IUpdateVendorStatusUsecase
  ) {}

  async addGuide(req : Request,res:Response) : Promise<void>{
      const agencyId = (req as CustomRequest).user.id;
      const guideData = (req.body) as UserDto;
      await this._addGuideUsecase.execute(guideData,agencyId);
      res.status(HTTP_STATUS.CREATED).json({success : true,message : SUCCESS_MESSAGE.ADD_GUIDE_SUCCESSFULLY})
  }

  async getDetails(req: Request, res: Response): Promise<void> {
    const vendorId = (req as CustomRequest).user.id;
    const vendor = await this.getVendorDetailsUsecase.execute(vendorId);
    res.status(HTTP_STATUS.OK).json({ success: true, vendor });
  }

  async updateVendorStatus(req: Request, res: Response): Promise<void> {
    const { vendorId, status } = req.body as {
      vendorId: string;
      status: string;
    };
    const response = await this.updateVendorStatusUsecase.execute(
      vendorId,
      status
    );
    res.status(HTTP_STATUS.OK).json({success : true,message : "status updated to reviewing"});
  }

  async addAddress(req: Request, res: Response): Promise<void> {
    const vendorId = (req as CustomRequest).user.id;
    const data = { ...req.body, userId: vendorId } as AddressDto;
    const response = await this.addAddressUsecase.execute(data);
    res.status(response.statusCode).json(response.content);
  }

  async addKyc(req: Request, res: Response): Promise<void> {
    const vendorId = (req as CustomRequest).user.id;
    const data = { ...req.body, vendorId } as KycDto;
    const response = await this.addKycUsecase.execute(data);
    res.status(response.statusCode).json(response.content);
  }
}

