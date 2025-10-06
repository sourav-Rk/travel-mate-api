import { inject, injectable } from "tsyringe";

import { IVendorEntity } from "../../../../domain/entities/vendor.entity";
import { IVendorRepository } from "../../../../domain/repositoryInterfaces/vendor/vendor-repository.interface";
import { IGetVendorDetailsForStatusUsecase } from "../../interfaces/vendor/get-vendor-details.usecase.interface";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../../../shared/constants";
import { CustomError } from "../../../../domain/errors/customError";

@injectable()
export class GetVendorDetailsForStatusUsecase
  implements IGetVendorDetailsForStatusUsecase
{
  constructor(
    @inject("IVendorRepository")
    private vendorRepository: IVendorRepository
  ) {}

  async execute(vendorId: any): Promise<Partial<IVendorEntity | null>> {
    const vendor = await this.vendorRepository.findById(vendorId);

    if (!vendor) {
      throw new CustomError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_MESSAGE.USER_NOT_FOUND
      );
    }
    return {
      _id: vendor._id,
      status: vendor.status,
      agencyName: vendor.agencyName,
    };
  }
}
