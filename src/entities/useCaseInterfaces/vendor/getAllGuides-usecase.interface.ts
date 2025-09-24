import { PaginatedUsers } from "../../modelsEntity/paginated-users.entity";

export interface IGetAllGuidesUsecase {
  execute(
    pageNumber: number,
    pageSize: number,
    searchTerm: string,
    status: string,
    agencyId: any,
    languages ?: string[],
    minExperience ?: number,
    maxExperience ?: number,
    gender ?: string
  ): Promise<PaginatedUsers>;
}
