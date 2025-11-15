import { ClientSession } from "mongoose";

import {
  IPackage,
  PaginatedPackagesRepo,
} from "../../../application/dto/response/packageDto";
import { PackageStatus, TRole } from "../../../shared/constants";
import { IPackageEntity } from "../../entities/package.entity";
import { IBaseRepository } from "../baseRepository.interface";


export interface IPackageRepository extends IBaseRepository<IPackageEntity> {
  findByPackageId(packageId: string): Promise<IPackageEntity | null>;
  findByItineraryId(id: string): Promise<IPackageEntity | null>;
  findByPackagesByTodayDate(startDate: Date): Promise<IPackageEntity[]>;
  findByGuideId(guideId: string): Promise<IPackageEntity[] | []>;
  findByPackagesApplicationDeadline(deadline: Date): Promise<IPackageEntity[]>;
  save(data: IPackageEntity, session?: ClientSession): Promise<IPackageEntity>;
  update(
    id: string,
    data: Partial<IPackageEntity>,
    session?: ClientSession
  ): Promise<IPackageEntity>;
  updatePackageStatus(
    packageId: string,
    status: PackageStatus
  ): Promise<IPackageEntity | null>;
  find(criteria: {
    userId: string;
    userType: TRole;
    searchTerm: string;
    status: string;
    category: string;
    pageNumber: number;
    pageSize: number;
  }): Promise<PaginatedPackagesRepo>;
  getPackageDetails(id: string): Promise<IPackage>;
  updateBlock(
    packageId: string,
    isBlocked: boolean
  ): Promise<IPackageEntity | null>;
  getActivePackages(
    search: string,
    categories: string[],
    priceRange: number[],
    duration: string,
    pageNumber: number,
    pageSize: number,
    sortBy: string
  ): Promise<PaginatedPackagesRepo>;
  getTrendingPackages(): Promise<IPackageEntity[]>;

  getFeaturedPackages(category: string): Promise<IPackageEntity[]>;

  findAssignedPackages(
    packageIds: string[],
    searchTerm: string,
    status: string,
    pageNumber: number,
    pageSize: number
  ): Promise<PaginatedPackagesRepo>;

  findByAgencyId(vendorId : string) : Promise<IPackageEntity[] | []>;

  countAllPackages(): Promise<number>;
  
  countCompletedPackages(): Promise<number>;
}
