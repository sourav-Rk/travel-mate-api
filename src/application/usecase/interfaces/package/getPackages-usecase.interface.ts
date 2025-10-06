import { TRole } from "../../../../shared/constants";
import { PaginatedPackages } from "../../../../domain/entities/paginated-packages.entity";

export interface IGetPackagesUsecase {
  execute(
    userId: any,
    searchTerm: string,
    satus: string,
    category: string,
    pageNumber: number,
    pageSize: number,
    userType: TRole
  ): Promise<PaginatedPackages>;
}
