import { PaginatedPackagesUserSideListing } from "../../../../dto/response/packageDto";
import { PaginatedPackages } from "../../../../../domain/entities/paginated-packages.entity";

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
