import { PaginatedUsers } from "../../modelsEntity/paginated-users.entity";

export interface IGetAllGuidesUsecase{
    execute(pageNumber : number,pageSize : number,searchTerm : string,status : string,agencyId : any ) : Promise<PaginatedUsers>
}