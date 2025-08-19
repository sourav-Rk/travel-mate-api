import { PaginatedPackages } from "../../modelsEntity/paginated-packages.entity";

export interface IGetPackagesUsecase {
  execute(
    agencyId: any,
    searchTerm: string,
    satus: string,
    category: string,
    pageNumber: number,
    pageSize: number
  ): Promise<PaginatedPackages>;
}
