import { PaginatedPackages } from "../../../../domain/entities/paginated-packages.entity";

export interface IAssignedTripsUsecase {
  execute(
    guideId: string,
    searchTerm: string,
    status: string,
    pageNumber: number,
    pageSize: number
  ): Promise<PaginatedPackages>;
}
