import { inject, injectable } from "tsyringe";

import { IPackageEntity } from "../../../entities/modelsEntity/package.entity";
import { IPackageRepository } from "../../../entities/repositoryInterfaces/package/package-repository.interface";
import { IGetFeaturedPackagesUsecase } from "../../../entities/useCaseInterfaces/package/client-package/getFeaturedPackages-usecase.interface";
import { ERROR_MESSAGE } from "../../../shared/constants";
import { NotFoundError } from "../../../shared/utils/error/notFoundError";
import { ValidationError } from "../../../shared/utils/error/validationError";

@injectable()
export class GetFeaturedPackagesUsecase implements IGetFeaturedPackagesUsecase {
    constructor(
      @inject('IPackageRepository')
      private _packageRepository : IPackageRepository
    ){}

    async execute(packageId: any): Promise<IPackageEntity[]> {

      console.log(packageId,"-->usecase")
         if(!packageId){
            throw new ValidationError(ERROR_MESSAGE.PACKAGE_ID_IS_REQUIRED);
         }
         
         const existingPackage = await this._packageRepository.findByPackageId(packageId);

         if(!existingPackage){
            throw new NotFoundError(ERROR_MESSAGE.PACKAGE_NOT_FOUND);
         }

         const response = await this._packageRepository.getFeaturedPackages(existingPackage.category);
         return response;
    }
}