import { IVendorEntity } from "../../../../domain/entities/vendor.entity";

export interface IGetVendorDetailsForStatusUsecase {
  execute(vendorId: string): Promise<Partial<IVendorEntity | null>>;
}
