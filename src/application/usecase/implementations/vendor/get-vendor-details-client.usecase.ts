import { inject, injectable } from "tsyringe";
import { IGetVendorDetailsClientUsecase } from "../../interfaces/vendor/get-vendor-details-client-usecase.interface";
import { IVendorRepository } from "../../../../domain/repositoryInterfaces/vendor/vendor-repository.interface";
import { IVendorEntity } from "../../../../domain/entities/vendor.entity";
import { VendorDetailsForClientDto } from "../../../dto/response/vendor.dto";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ERROR_MESSAGE } from "../../../../shared/constants";
import { VendorMapper } from "../../../mapper/vendor.mapper";
import { IVendorModel } from "../../../../infrastructure/database/models/vendor.model";

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
