import { inject, injectable } from "tsyringe";

import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { IVendorRepository } from "../../../../domain/repositoryInterfaces/vendor/vendor-repository.interface";
import { ERROR_MESSAGE } from "../../../../shared/constants";
import { VendorDetailsForClientDto } from "../../../dto/response/vendor.dto";
import { VendorMapper } from "../../../mapper/vendor.mapper";
import { IGetVendorDetailsClientUsecase } from "../../interfaces/vendor/get-vendor-details-client-usecase.interface";

@injectable()
export class GetVendorDetailsClientUsecase
  implements IGetVendorDetailsClientUsecase
{
  constructor(
    @inject("IVendorRepository")
    private _vendorRepository: IVendorRepository
  ) {}

  async execute(vendorId: string): Promise<VendorDetailsForClientDto | null> {
    const vendor = await this._vendorRepository.findById(vendorId);
    if (!vendor) {
      throw new NotFoundError(ERROR_MESSAGE.AGENCY_NOT_FOUND);
    }

    return VendorMapper.mapToVendorDetailsForClientDto(vendor);
  }
}
