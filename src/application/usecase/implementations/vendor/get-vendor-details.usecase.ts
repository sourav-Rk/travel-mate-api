import { inject, injectable } from "tsyringe";

import { CustomError } from "../../../../domain/errors/customError";
import { IVendorRepository } from "../../../../domain/repositoryInterfaces/vendor/vendor-repository.interface";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../../../shared/constants";
import { VendorProfileDto } from "../../../dto/response/vendor.dto";
import { VendorMapper } from "../../../mapper/vendor.mapper";
import { IGetVendorDetailsUsecase } from "../../interfaces/vendor/get-vendor-details-usecase.interface";

@injectable()
export class GetVendorDetailsUsecase implements IGetVendorDetailsUsecase {
  constructor(
    @inject("IVendorRepository")
    private _vendorRepository: IVendorRepository
  ) {}

  async execute(id: string): Promise<VendorProfileDto | null> {
    if (!id) {
      throw new CustomError(HTTP_STATUS.BAD_REQUEST, ERROR_MESSAGE.ID_REQUIRED);
    }

    const vendor = await this._vendorRepository.findById(id);

    if (!vendor) {
      throw new CustomError(
        HTTP_STATUS.BAD_REQUEST,
        ERROR_MESSAGE.USER_NOT_FOUND
      );
    }

    const vendorDetails =
      await this._vendorRepository.getVendorWithAddressAndKyc(id);

    return VendorMapper.mapVendorToFullInfoDto(vendorDetails!);
  }
}
