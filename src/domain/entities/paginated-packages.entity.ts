import { PackageListingTableDto } from "../../application/dto/response/packageDto";

export interface PaginatedPackages {
  packages: PackageListingTableDto[] | [];
  total: number;
}
