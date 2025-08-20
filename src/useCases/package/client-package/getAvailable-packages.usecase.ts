import { inject, injectable } from "tsyringe";
import { IGetAvailablePackagesUsecase } from "../../../entities/useCaseInterfaces/package/client-package/getAvailable-package-usecase.interface";
import { IPackageRepository } from "../../../entities/repositoryInterfaces/package/package-repository.interface";
import { PaginatedPackages } from "../../../entities/modelsEntity/paginated-packages.entity";
import { any } from "zod";

@injectable()
export class GetAvailbalePackagesUsecase
  implements IGetAvailablePackagesUsecase
{
  constructor(
    @inject("IPackageRepository")
    private _packagesRepository: IPackageRepository
  ) {}

  async execute(
    search: string,
    categories: string[],
    priceRange: number[],
    duration: string,
    pageNumber: number,
    pageSize: number,
    sortBy: string
  ): Promise<PaginatedPackages> {
    let filter: any = { status: "active" };

    if (search) {
      filter.$or = [
        { packageName: { $regex: search, $options: "i" } },
        { title: { $regex: search, $options: "i" } },
      ];
    }

    if (categories && categories.length > 0) {
      filter.category = {
        $in: categories.map((cat) => new RegExp(`^${cat}$`, "i")),
      };
    }

    if (priceRange && priceRange.length === 2) {
      filter.price = { $gte: priceRange[0], $lte: priceRange[1] };
    }

    if (duration && duration.includes("-")) {
      const [min, max] = duration.split("-").map(Number);
      filter["duration.days"] = { $gte: min, $lte: max };
    }

    //pagination
    const validPageNumber = Math.max(1, pageNumber || 0);
    const validPageSize = Math.max(1, pageSize || 10);
    const skip = (validPageNumber - 1) * validPageSize;
    const limit = validPageSize;

    //sorting
    const sortField: any = {};
    if (sortBy === "price-high") sortField.price = -1;
    else if (sortBy === "price-low") sortField.price = 1;
    else if (sortBy === "days-long") sortField["duration.days"] = -1;
    else if (sortBy === "days-short") sortField["duration.days"] = 1;
    else sortField.createdAt = -1;

    const { packages, total } =
      await this._packagesRepository.getActivePackages(
        skip,
        limit,
        filter,
        sortField
      );

    const response: PaginatedPackages = {
      packages,
      total: Math.ceil(total / validPageSize),
    };
    return response;
  }
}
