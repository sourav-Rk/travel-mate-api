import { TRole } from "../../../shared/constants";
import { IVendorEntity } from "../../modelsEntity/vendor.entity";

export interface IVendorRepository {
  save(data: Partial<IVendorEntity>): Promise<IVendorEntity>;
  findByEmail(email: string): Promise<IVendorEntity | null>;
  findByNumber(phone: string): Promise<IVendorEntity | null>;
  findById(vendorId: string): Promise<IVendorEntity | null>;
  findByIdAndUpdate(id: string, data: Partial<IVendorEntity>): Promise<void>;
  findByIdAndUpdatePassword(
    id: any,
    password: string
  ): Promise<IVendorEntity | null>;
  findByIdAndUpdateStatus(
    vendorId: string,
    status: string,
    reason?: string
  ): Promise<void>;
  findByIdAndUpdateBlock(vendorId: string): Promise<boolean>;
  getVendorWithAddressAndKyc(vendorId: string): Promise<IVendorEntity | null>;
  find(
    searchTerm: string,
    status: string,
    userType: TRole,
    validPageNumber: number,
    validPageSize: number
  ): Promise<{ user: IVendorEntity[] | []; total: number }>;
}
