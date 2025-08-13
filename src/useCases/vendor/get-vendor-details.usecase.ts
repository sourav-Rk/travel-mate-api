import { inject, injectable } from "tsyringe";

import { IVendorEntity } from "../../entities/modelsEntity/vendor.entity";
import { IVendorRepository } from "../../entities/repositoryInterfaces/vendor/vendor-repository.interface";
import { IGetVendorDetailsUsecase } from "../../entities/useCaseInterfaces/vendor/get-vendor-details-usecase.interface";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../shared/constants";
import { CustomError } from "../../shared/utils/error/customError";

@injectable()
export class GetVendorDetailsUsecase implements IGetVendorDetailsUsecase {
    constructor(
        @inject('IVendorRepository')
        private _vendorRepository : IVendorRepository
    ){}

    async execute(id: any): Promise<IVendorEntity | null> {
        if(!id) {
            throw new CustomError(HTTP_STATUS.BAD_REQUEST,"Vendor id is missing");
        }

        const vendor = await this._vendorRepository.findById(id);

        if(!vendor){
            throw new CustomError(HTTP_STATUS.BAD_REQUEST,ERROR_MESSAGE.USER_NOT_FOUND);
        }

        const vendorDetails = await this._vendorRepository.getVendorWithAddressAndKyc(id);

        return vendorDetails;
    }
}