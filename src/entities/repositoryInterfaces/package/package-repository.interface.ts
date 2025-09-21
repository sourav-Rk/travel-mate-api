import { PackageStatus, TRole } from "../../../shared/constants";
import { IPackage, PaginatedPackagesRepo } from "../../../shared/dto/packageDto";
import { IPackageEntity } from "../../modelsEntity/package.entity";
import { IBaseRepository } from "../baseRepository.interface";

export interface IPackageRepository extends IBaseRepository<IPackageEntity> {
  findByPackageId(packageId : string) : Promise<IPackageEntity | null>;
  findByItineraryId(id : string) : Promise<IPackageEntity | null>;
  findByPackagesByTodayDate(startDate : Date) : Promise<IPackageEntity[]>;
  findByPackagesApplicationDeadline(deadline : Date) : Promise<IPackageEntity[]>;
  save(data: IPackageEntity, session?: any): Promise<IPackageEntity>;
  update(
    id: any,
    data: Partial<IPackageEntity>,
    session?: any
  ): Promise<IPackageEntity>;
  updatePackageStatus(packageId : string,status : PackageStatus) : Promise<IPackageEntity | null>;
  find(
    criteria : {userId: any,
    userType: TRole,
    searchTerm: string,
    status: string,
    category: string,
    pageNumber: number,
    pageSize: number}
  ): Promise<PaginatedPackagesRepo>;
  getPackageDetails(id: any): Promise<IPackage>;
  updateBlock(packageId : string,isBlocked : boolean) : Promise<IPackageEntity | null>;
  getActivePackages(
    search : string,
    categories : string [],
    priceRange : number[],
    duration : string,
    pageNumber : number,
    pageSize : number,
    sortBy : string
  ): Promise<PaginatedPackagesRepo>;
  getTrendingPackages() : Promise<IPackageEntity[]>

  getFeaturedPackages(category: string): Promise<IPackageEntity[]>;
}
