import { inject, injectable } from "tsyringe";
import { IGetFeaturedPackagesUsecase } from "../../../entities/useCaseInterfaces/package/client-package/getFeaturedPackages-usecase.interface";
import { IPackageRepository } from "../../../entities/repositoryInterfaces/package/package-repository.interface";
import { ValidationError } from "../../../shared/utils/error/validationError";
import { ERROR_MESSAGE } from "../../../shared/constants";
import { NotFoundError } from "../../../shared/utils/error/notFoundError";
import { IPackageEntity } from "../../../entities/modelsEntity/package.entity";

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
         
         const existingPackage = await this._packageRepository.findById(packageId);

         if(!existingPackage){
            throw new NotFoundError(ERROR_MESSAGE.PACKAGE_NOT_FOUND);
         }

         const response = await this._packageRepository.getFeaturedPackages(existingPackage.category);
         return response;
    }
}