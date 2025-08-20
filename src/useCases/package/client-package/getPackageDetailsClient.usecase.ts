import { inject, injectable } from "tsyringe";
import { IGetPackageDetailsClientUsecase } from "../../../entities/useCaseInterfaces/package/client-package/getPackageDetailsClient-usecase.interface";
import { IPackageRepository } from "../../../entities/repositoryInterfaces/package/package-repository.interface";
import { NotFoundError } from "../../../shared/utils/error/notFoundError";
import { ERROR_MESSAGE } from "../../../shared/constants";
import { IPackage } from "../../../shared/dto/packageDto";

@injectable()
export class GetPackageDetailsClientUsecase implements IGetPackageDetailsClientUsecase{
    constructor(
        @inject('IPackageRepository')
        private _packageRepository : IPackageRepository
    ){}

    async execute(packageId: string): Promise<IPackage> {
        if(!packageId) {
            throw new NotFoundError(ERROR_MESSAGE.PACKAGE_ID_IS_REQUIRED);
        }

        const packageExist = await this._packageRepository.findById(packageId);

        if(!packageExist) {
            throw new NotFoundError(ERROR_MESSAGE.PACKAGE_NOT_FOUND);
        }
        
        const response = await this._packageRepository.getPackageDetails(packageId);
        return response;
        
    }
}