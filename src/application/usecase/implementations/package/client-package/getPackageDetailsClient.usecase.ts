import { inject, injectable } from "tsyringe";

import { NotFoundError } from "../../../../../domain/errors/notFoundError";
import { IPackageRepository } from "../../../../../domain/repositoryInterfaces/package/package-repository.interface";
import { ERROR_MESSAGE } from "../../../../../shared/constants";
import { IPackage } from "../../../../dto/response/packageDto";
import { IGetPackageDetailsClientUsecase } from "../../../interfaces/package/client-package/getPackageDetailsClient-usecase.interface";

@injectable()
export class GetPackageDetailsClientUsecase
  implements IGetPackageDetailsClientUsecase
{
  constructor(
    @inject("IPackageRepository")
    private _packageRepository: IPackageRepository
  ) {}

  async execute(packageId: string): Promise<IPackage> {
    if (!packageId) {
      throw new NotFoundError(ERROR_MESSAGE.PACKAGE_ID_IS_REQUIRED);
    }

    const packageExist = await this._packageRepository.findByPackageId(
      packageId
    );

    if (!packageExist) {
      throw new NotFoundError(ERROR_MESSAGE.PACKAGE_NOT_FOUND);
    }

    const response = await this._packageRepository.getPackageDetails(packageId);
    return response;
  }
}
