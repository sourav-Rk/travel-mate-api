import { PaginatedPackagesUserSideListing } from "../../../../dto/response/packageDto";

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
