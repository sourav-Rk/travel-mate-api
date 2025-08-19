import { IPackageEntity } from "./package.entity";

export interface PaginatedPackages{
    packages : IPackageEntity[] | [];
    total : number;
}