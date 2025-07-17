import { IClientEntity } from "./client.entity";
import { IUserEntity } from "./user.entity";
import { IVendorEntity } from "./vendor.entity";

export interface PaginatedUsers {
    user : IClientEntity[] | IVendorEntity[] | [];
    total : number;
}