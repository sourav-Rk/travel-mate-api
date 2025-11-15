import { PaginatedUsers } from "../../../../domain/entities/paginated-users.entity";

export interface IGetAllGuidesUsecase {
  execute(
    pageNumber: number,
    pageSize: number,
    searchTerm: string,
    status: string,
    agencyId: string,
    languages?: string[],
    minExperience?: number,
    maxExperience?: number,
    gender?: string
  ): Promise<PaginatedUsers>;
}
