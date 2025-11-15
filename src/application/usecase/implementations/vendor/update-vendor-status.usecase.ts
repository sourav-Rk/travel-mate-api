import { inject, injectable } from "tsyringe";

import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { IVendorRepository } from "../../../../domain/repositoryInterfaces/vendor/vendor-repository.interface";
import { ERROR_MESSAGE } from "../../../../shared/constants";
import { IUpdateVendorStatusUsecase } from "../../interfaces/vendor/update-vendor-status.usecase.interface";

@injectable()
export class UpdateVendorStatusUsecase implements IUpdateVendorStatusUsecase {
  constructor(
    @inject("IVendorRepository")
    private vendorRepository: IVendorRepository
  ) {}

  async execute(vendorId: string, status: string): Promise<void> {
    
    const vendor = await this.vendorRepository.findById(vendorId);
  
    if (!vendor) throw new NotFoundError(ERROR_MESSAGE.USER_NOT_FOUND);

    await this.vendorRepository.findByIdAndUpdateStatus(vendorId, status);
  }
}
