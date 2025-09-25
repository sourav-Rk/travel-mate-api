import { inject, injectable } from "tsyringe";

import { IPackageRepository } from "../../entities/repositoryInterfaces/package/package-repository.interface";
import { IUpdateBlockStatusUsecase } from "../../entities/useCaseInterfaces/package/update-block-status-usecase.interface";
import { ERROR_MESSAGE } from "../../shared/constants";
import { NotFoundError } from "../../shared/utils/error/notFoundError";
import { ValidationError } from "../../shared/utils/error/validationError";

@injectable()
export class UpdateBlockStatusUsecase implements IUpdateBlockStatusUsecase{
    constructor(
      @inject('IPackageRepository')
      private _packageRepository : IPackageRepository
    ){}

    async execute(packageId: string): Promise<void> {
        if(!packageId){
            throw new ValidationError(ERROR_MESSAGE.PACKAGE_ID_IS_REQUIRED)
        }

        const existingPackage = await this._packageRepository.findById(packageId);

        if(!existingPackage){
            throw new NotFoundError(ERROR_MESSAGE.PACKAGE_NOT_FOUND);
        }



        if(existingPackage.paymentAlertSentAt){
            throw new ValidationError(ERROR_MESSAGE.PACKAGE_CANNOT_BE_BLOCKED);
        }
       
        await this._packageRepository.updateBlock(packageId,existingPackage.isBlocked!);
        
    }
}