import { inject, injectable } from "tsyringe";
import { IUpdateVendorProfileUsecase } from "../../entities/useCaseInterfaces/vendor/update-vendor-profile-usecase.interface";
import { IVendorEntity } from "../../entities/modelsEntity/vendor.entity";
import { IVendorRepository } from "../../entities/repositoryInterfaces/vendor/vendor-repository.interface";
import { ValidationError } from "../../shared/utils/error/validationError";
import { NotFoundError } from "../../shared/utils/error/notFoundError";
import { IPhoneExistenceService } from "../../entities/serviceInterfaces/phone-existence-service.interface";
import { CustomError } from "../../shared/utils/error/customError";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../shared/constants";

@injectable()
export class UpdateVendorProfileUsecase implements IUpdateVendorProfileUsecase{
   constructor(
     @inject('IVendorRepository')
     private _vendorRepository : IVendorRepository,

     @inject('IPhoneExistenceService')
     private _phoneExistenceService : IPhoneExistenceService

   ){}

   async execute(id: string, data: Partial<IVendorEntity>): Promise<void> {
        if(!id) throw new ValidationError("Vendor id is required");

        const vendor = await this._vendorRepository.findById(id)
        if(!vendor) throw new NotFoundError("user not found");

        if(data.phone && data?.phone !== vendor.phone){
           const isPhoneExists = await this._phoneExistenceService.phoneExists(data?.phone);
           if(isPhoneExists) throw new CustomError(HTTP_STATUS.CONFLICT,ERROR_MESSAGE.PHONE_NUMBER_EXISTS);
        }

        await this._vendorRepository.findByIdAndUpdate(id,data)
        
   }
}