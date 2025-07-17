import { PaginatedUsers } from "../../modelsEntity/paginated-users.entity";

export interface IGetAllUsersUsecase {
  execute(
    userType: string,
    pageNumber: number,
    pageSize: number,
    searchTerm: string,
    status?: string
  ): Promise<PaginatedUsers>;
}
