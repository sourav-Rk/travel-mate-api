import { inject, injectable } from "tsyringe";

import { IVendorRepository } from "../../../../domain/repositoryInterfaces/vendor/vendor-repository.interface";
import { IUpdateVendorStatusUsecase } from "../../interfaces/vendor/update-vendor-status.usecase.interface";
import { NotFoundError } from "../../../../domain/errors/notFoundError";

@injectable()
export class UpdateVendorStatusUsecase implements IUpdateVendorStatusUsecase {
  constructor(
    @inject("IVendorRepository")
    private vendorRepository: IVendorRepository
  ) {}

  async execute(vendorId: string, status: string): Promise<void> {
    console.log(vendorId, "--->lid");
    const vendor = await this.vendorRepository.findById(vendorId);
    console.log(vendor, "--<vendkr");

    if (!vendor) throw new NotFoundError("user not found");

    await this.vendorRepository.findByIdAndUpdateStatus(vendorId, status);
  }
}
