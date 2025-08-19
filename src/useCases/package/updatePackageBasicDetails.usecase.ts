import { inject, injectable } from "tsyringe";
import { IUpdatePackageBasicDetailsUsecase } from "../../entities/useCaseInterfaces/package/updatePackageBasicdetails-usecase.interface";
import { IPackageRepository } from "../../entities/repositoryInterfaces/package/package-repository.interface";
import { ValidationError } from "../../shared/utils/error/validationError";
import { ERROR_MESSAGE } from "../../shared/constants";
import { IVendorRepository } from "../../entities/repositoryInterfaces/vendor/vendor-repository.interface";
import { NotFoundError } from "../../shared/utils/error/notFoundError";
import { IPackageEntity } from "../../entities/modelsEntity/package.entity";

@injectable()
export class UpdatePackageBasicDetailsUsecase implements IUpdatePackageBasicDetailsUsecase{
    constructor(
       @inject('IPackageRepository')
       private _packageRepository : IPackageRepository,

       @inject('IVendorRepository')
       private _vendorRepository : IVendorRepository
    ){}

    async execute(agencyId: string, packageId : string, data: IPackageEntity): Promise<void> {
        if(!agencyId){
            throw new ValidationError(ERROR_MESSAGE.USER_ID_REQUIRED);
        }

        const agencyExist = await this._vendorRepository.findById(agencyId);

        if(!agencyExist){
             throw new NotFoundError(ERROR_MESSAGE.USER_NOT_FOUND);
        }

        const existingPackage = await this._packageRepository.findById(packageId);
        
        if(!existingPackage){
            throw new NotFoundError(ERROR_MESSAGE.PACKAGE_NOT_FOUND);
        }

        await this._packageRepository.update(packageId,data);
    }
}