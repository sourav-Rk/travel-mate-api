import { PaginatedCancellationRequests } from "../../../dto/response/bookingDto";

export interface IGetCancellationRequests {
  execute(
    vendorId: string,
    page : number,
    limit:number,
    searchTerm: string,
    status: "cancellation_requested" | "cancelled"
  ): Promise<PaginatedCancellationRequests>;
}
