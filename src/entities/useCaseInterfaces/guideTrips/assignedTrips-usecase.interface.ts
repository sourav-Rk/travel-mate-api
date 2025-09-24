import { PackageListingTableDto } from "../../../shared/dto/packageDto";
import { PaginatedPackages } from "../../modelsEntity/paginated-packages.entity";

export interface IAssignedTripsUsecase {
  execute(
    guideId: string,
    searchTerm: string,
    status: string,
    pageNumber: number,
    pageSize: number
  ): Promise<PaginatedPackages>;
}
