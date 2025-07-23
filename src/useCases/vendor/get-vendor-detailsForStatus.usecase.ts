import { inject, injectable } from "tsyringe";
import { IGetVendorDetailsForStatusUsecase } from "../../entities/useCaseInterfaces/vendor/get-vendor-details.usecase.interface";
import { IVendorEntity } from "../../entities/modelsEntity/vendor.entity";
import { IVendorRepository } from "../../entities/repositoryInterfaces/vendor/vendor-repository.interface";
import { CustomError } from "../../shared/utils/error/customError";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../shared/constants";

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
