import { IClientEntity } from "./client.entity";
import { IGuideEntity } from "./guide.entity";
import { IVendorEntity } from "./vendor.entity";

export interface PaginatedUsers {
    user : IClientEntity[] | IVendorEntity[] | IGuideEntity[] | [];
    total : number;
}