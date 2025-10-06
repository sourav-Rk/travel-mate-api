import { IVendorEntity } from "../../../../domain/entities/vendor.entity";

export interface IGetVendorDetailsForStatusUsecase {
  execute(vendorId: any): Promise<Partial<IVendorEntity | null>>;
}
