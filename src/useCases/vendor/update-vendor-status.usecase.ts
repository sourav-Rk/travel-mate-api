import { inject, injectable } from "tsyringe";
import { IVendorRepository } from "../../entities/repositoryInterfaces/vendor/vendor-repository.interface";
import { NotFoundError } from "../../shared/utils/error/notFoundError";
import { IUpdateVendorStatusUsecase } from "../../entities/useCaseInterfaces/vendor/update-vendor-status.usecase.interface";

@injectable()
export class UpdateVendorStatusUsecase implements IUpdateVendorStatusUsecase{
    constructor(
        @inject('IVendorRepository')
        private vendorRepository : IVendorRepository
    ){}

    async execute(vendorId: string, status: string): Promise<void> {
        const vendor = await this.vendorRepository.findById(vendorId);

        if(!vendor) throw new NotFoundError("user not found");

        await this.vendorRepository.findByIdAndUpdateStatus(vendorId,status);
       
    }
}