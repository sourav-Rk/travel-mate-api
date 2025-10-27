import { inject, injectable } from "tsyringe";

import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { IPackageRepository } from "../../../../domain/repositoryInterfaces/package/package-repository.interface";
import { ERROR_MESSAGE } from "../../../../shared/constants";
import { IPackage } from "../../../dto/response/packageDto";
import { IViewPackageDetailsUsecase } from "../../interfaces/guideTrips/viewPackageDetails-usecase.interface";

@injectable()
export class ViewPackageDetailsGuideUsecase
  implements IViewPackageDetailsUsecase
{
  constructor(
    @inject("IPackageRepository")
    private _packageRespository: IPackageRepository
  ) {}

  async execute(packageId: string): Promise<IPackage> {
    const packageExist = await this._packageRespository.findByPackageId(
      packageId
    );
    if (!packageExist) {
      throw new NotFoundError(ERROR_MESSAGE.PACKAGE_NOT_FOUND);
    }

    const response = await this._packageRespository.getPackageDetails(
      packageId
    );
    return response;
  }
}
