import { inject, injectable } from "tsyringe";
import { IGetPackageDetailsUsecase } from "../../entities/useCaseInterfaces/package/getPackageDetails-usecase.interface";
import { IPackageRepository } from "../../entities/repositoryInterfaces/package/package-repository.interface";
import { ValidationError } from "../../shared/utils/error/validationError";
import { ERROR_MESSAGE } from "../../shared/constants";
import { IVendorRepository } from "../../entities/repositoryInterfaces/vendor/vendor-repository.interface";
import { NotFoundError } from "../../shared/utils/error/notFoundError";
import { IPackage } from "../../shared/dto/packageDto";

@injectable()
export class GetPackageDetailsUsecase implements IGetPackageDetailsUsecase{
    constructor(
        @inject('IPackageRepository')
        private _packageRepository : IPackageRepository,

        @inject('IVendorRepository')
        private _vendorRepository : IVendorRepository
    ){}

    async execute(agencyId: string, packageId: string): Promise<IPackage> {
        if(!agencyId || !packageId){
            throw new ValidationError(ERROR_MESSAGE.AGENCY_ID_AND_PACKAGE_ID_IS_REQUIRED);
        }

        const agency = await this._vendorRepository.findById(agencyId);

        if(!agency){
            throw new NotFoundError(ERROR_MESSAGE.AGENCY_NOT_FOUND)
        }

        const response = await this._packageRepository.getPackageDetails(packageId);
        return response;
    }
}