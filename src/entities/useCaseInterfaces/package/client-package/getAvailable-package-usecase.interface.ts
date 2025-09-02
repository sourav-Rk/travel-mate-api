import { PaginatedPackagesUserSideListing } from "../../../../shared/dto/packageDto";
import { PaginatedPackages } from "../../../modelsEntity/paginated-packages.entity";

export interface IGetAvailablePackagesUsecase {
  execute(
  search: string,
    categories: string[],
    priceRange: number[],
    duration: string,
    pageNumber: number,
    pageSize: number,
    sortBy: string
  ): Promise<PaginatedPackagesUserSideListing>;
}
