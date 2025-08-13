import { inject, injectable } from "tsyringe";

import { IVendorEntity } from "../../entities/modelsEntity/vendor.entity";
import { IVendorRepository } from "../../entities/repositoryInterfaces/vendor/vendor-repository.interface";
import { IGetVendorDetailsForStatusUsecase } from "../../entities/useCaseInterfaces/vendor/get-vendor-details.usecase.interface";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../shared/constants";
import { CustomError } from "../../shared/utils/error/customError";

@injectable()
export class GetVendorDetailsForStatusUsecase implements IGetVendorDetailsForStatusUsecase {
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
      _id :vendor._id,
      status : vendor.status,
      agencyName : vendor.agencyName
    }
  }
}
