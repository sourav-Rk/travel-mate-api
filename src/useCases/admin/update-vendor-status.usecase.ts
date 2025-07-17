import { inject, injectable } from "tsyringe";
import { IUpdateVendorStatusUsecase } from "../../entities/useCaseInterfaces/vendor/update-vendor-status.usecase.interface";
import { IVendorRepository } from "../../entities/repositoryInterfaces/vendor/vendor-repository.interface";
import { ISuccessResponseHandler } from "../../shared/utils/successResponseHandler";
import { CustomError } from "../../shared/utils/error/customError";
import { HTTP_STATUS, STATUS } from "../../shared/constants";
import { NotFoundError } from "../../shared/utils/error/notFoundError";

@injectable()
export class UpdateVendorStatusUsecase implements IUpdateVendorStatusUsecase{
    constructor(
      @inject('IVendorRepository')
      private _vendorRepository : IVendorRepository
    ){}
    async execute(vendorId: string, status: string): Promise<void> {
        if(!vendorId || !status) throw new CustomError(HTTP_STATUS.BAD_REQUEST,"vendor id and status are required");

        if(vendorId && status){
            const vendor = await this._vendorRepository.findById(vendorId);
            if(!vendor) throw new NotFoundError("user not found");
            await this._vendorRepository.findByIdAndUpdateStatus(vendorId,status);
        }
    }
}