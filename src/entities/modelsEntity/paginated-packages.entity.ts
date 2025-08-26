import { PackageListingTableDto } from "../../shared/dto/packageDto";

export interface PaginatedPackages{
    packages : PackageListingTableDto[] | [];
    total : number;
}