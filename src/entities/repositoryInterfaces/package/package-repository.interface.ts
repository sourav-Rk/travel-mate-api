import { IPackage } from "../../../shared/dto/packageDto";
import { IPackageEntity } from "../../modelsEntity/package.entity";
import { PaginatedPackages } from "../../modelsEntity/paginated-packages.entity";

export interface IPackageRepository {
  findById(id: string): Promise<IPackageEntity | null>;
  save(data: IPackageEntity, session?: any): Promise<IPackageEntity>;
  update(
    id: any,
    data: Partial<IPackageEntity>,
    session?: any
  ): Promise<IPackageEntity>;
  find(skip: number, limit: number, filter: any): Promise<PaginatedPackages>;
  getPackageDetails(id: any): Promise<IPackage>;
  getActivePackages(
    skip: number,
    limit: number,
    filter: any,
    sort: any
  ): Promise<PaginatedPackages>;

  getFeaturedPackages(category : string) : Promise<IPackageEntity[]>
}
