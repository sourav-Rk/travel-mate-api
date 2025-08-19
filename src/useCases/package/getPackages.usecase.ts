import { inject, injectable } from "tsyringe";
import { IGetPackagesUsecase } from "../../entities/useCaseInterfaces/package/getPackages-usecase.interface";
import { IPackageRepository } from "../../entities/repositoryInterfaces/package/package-repository.interface";
import { IVendorRepository } from "../../entities/repositoryInterfaces/vendor/vendor-repository.interface";
import { ValidationError } from "../../shared/utils/error/validationError";
import { CustomError } from "../../shared/utils/error/customError";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../shared/constants";
import { PaginatedPackages } from "../../entities/modelsEntity/paginated-packages.entity";

@injectable()
export class GetPackageUsecase implements IGetPackagesUsecase {
  constructor(
    @inject("IPackageRepository")
    private _packageRepository: IPackageRepository,

    @inject("IVendorRepository")
    private _vendorRepository: IVendorRepository
  ) {}

  async execute(
    agencyId: any,
    searchTerm: string,
    status: string,
    category: string,
    pageNumber: number,
    pageSize: number
  ): Promise<PaginatedPackages> {
    if (!agencyId) {
      throw new ValidationError("Agency id is required");
    }

    const agencyExist = await this._vendorRepository.findById(agencyId);

    if (!agencyExist) {
      throw new CustomError(
        HTTP_STATUS.BAD_REQUEST,
        ERROR_MESSAGE.USER_NOT_FOUND
      );
    }

    const filter: any = {};

    if (searchTerm) {
      filter.$or = [
        { packageName: { $regex: searchTerm, $options: "i" } },
        { title: { $regex: searchTerm, $options: "i" } },
        { tags: { $regex: searchTerm, $options: "i" } },
      ];
    }

    if (status && status !== "all") {
      filter.status = status;
    }

    if (category && category !== "all") {
      filter.category = category;
    }

    const validPageNumber = Math.max(1, pageNumber || 0);
    const validPageSize = Math.max(1, pageSize || 10);
    const skip = (validPageNumber - 1) * validPageSize;
    const limit = validPageSize;

    const { packages, total } = await this._packageRepository.find(
      skip,
      limit,
      filter
    );

    const response : PaginatedPackages = {
      packages,
      total : Math.ceil(total/validPageSize)
    }

     return response;
  }
}
