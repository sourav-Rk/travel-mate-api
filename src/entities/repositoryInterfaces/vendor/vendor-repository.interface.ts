import { IVendorEntity } from "../../modelsEntity/vendor.entity";

export interface IVendorRepository {
  save(data: Partial<IVendorEntity>): Promise<IVendorEntity>;
  findByEmail(email: string): Promise<IVendorEntity | null>;
  findByNumber(phone: string): Promise<IVendorEntity | null>;
  findById(vendorId: string): Promise<IVendorEntity | null>;
  findByIdAndUpdatePassword(id : any,password : string) : Promise<IVendorEntity | null>
  findByIdAndUpdateStatus(vendorId: string, status: string,reason?:string): Promise<void>;
  findByIdAndUpdateBlock(vendorId: string): Promise<boolean>;
  getVendorWithAddressAndKyc(vendorId : string) : Promise<IVendorEntity | null>
  find(
    filter: any,
    skip: number,
    limit: number
  ): Promise<{ user: IVendorEntity[] | []; total: number }>;
}
