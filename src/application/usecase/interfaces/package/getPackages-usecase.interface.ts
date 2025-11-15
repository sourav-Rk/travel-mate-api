import { PaginatedPackages } from "../../../../domain/entities/paginated-packages.entity";
import { TRole } from "../../../../shared/constants";

export interface IGetPackagesUsecase {
  execute(
    userId: string,
    searchTerm: string,
    satus: string,
    category: string,
    pageNumber: number,
    pageSize: number,
    userType: TRole
  ): Promise<PaginatedPackages>;
}
