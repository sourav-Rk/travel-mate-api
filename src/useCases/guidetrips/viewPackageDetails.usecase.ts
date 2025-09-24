import { inject, injectable } from "tsyringe";
import { IViewPackageDetailsUsecase } from "../../entities/useCaseInterfaces/guideTrips/viewPackageDetails-usecase.interface";
import { IPackageRepository } from "../../entities/repositoryInterfaces/package/package-repository.interface";
import { NotFoundError } from "../../shared/utils/error/notFoundError";
import { ERROR_MESSAGE } from "../../shared/constants";
import { IPackage } from "../../shared/dto/packageDto";

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
