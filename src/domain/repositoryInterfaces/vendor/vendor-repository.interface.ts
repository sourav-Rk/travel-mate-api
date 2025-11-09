import { IVendorWithAddressAndKycAggregationResult } from "../../../application/dto/response/vendor.dto";
import { TRole } from "../../../shared/constants";
import { IVendorEntity } from "../../entities/vendor.entity";
import { IBaseRepository } from "../baseRepository.interface";

export interface IVendorRepository extends IBaseRepository<IVendorEntity> {
  findByEmail(email: string): Promise<IVendorEntity | null>;
  findByNumber(phone: string): Promise<IVendorEntity | null>;
  findByIdAndUpdate(id: string, data: Partial<IVendorEntity>): Promise<void>;
  findByIdAndUpdatePassword(
    id: string,
    password: string
  ): Promise<IVendorEntity | null>;
  findByIdAndUpdateStatus(
    vendorId: string,
    status: string,
    reason?: string
  ): Promise<void>;
  findByIdAndUpdateBlock(vendorId: string): Promise<boolean>;
  getVendorWithAddressAndKyc(vendorId: string): Promise<IVendorWithAddressAndKycAggregationResult | null>;
  find(
    searchTerm: string,
    status: string,
    userType: TRole,
    validPageNumber: number,
    validPageSize: number
  ): Promise<{ user: IVendorEntity[] | []; total: number }>;
  getTotalAgenciesCount(): Promise<number>;
}
