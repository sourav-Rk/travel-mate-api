import { inject, injectable } from "tsyringe";

import { IVendorRepository } from "../../../../domain/repositoryInterfaces/vendor/vendor-repository.interface";
import { IGetVendorDetailsUsecase } from "../../interfaces/vendor/get-vendor-details-usecase.interface";
import { VendorMapper } from "../../../mapper/vendor.mapper";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../../../shared/constants";
import { VendorProfileDto } from "../../../dto/response/vendor.dto";
import { CustomError } from "../../../../domain/errors/customError";

@injectable()
export class GetVendorDetailsUsecase implements IGetVendorDetailsUsecase {
  constructor(
    @inject("IVendorRepository")
    private _vendorRepository: IVendorRepository
  ) {}

  async execute(id: any): Promise<VendorProfileDto | null> {
    if (!id) {
      throw new CustomError(HTTP_STATUS.BAD_REQUEST, "Vendor id is missing");
    }

    const vendor = await this._vendorRepository.findById(id);

    if (!vendor) {
      throw new CustomError(
        HTTP_STATUS.BAD_REQUEST,
        ERROR_MESSAGE.USER_NOT_FOUND
      );
    }

    const vendorDetails = VendorMapper.mapVendorToFullInfoDto(
      await this._vendorRepository.getVendorWithAddressAndKyc(id)
    );

    return vendorDetails;
  }
}
