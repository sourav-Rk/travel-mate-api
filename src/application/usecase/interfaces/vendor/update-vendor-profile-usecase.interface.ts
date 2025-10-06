import { IVendorEntity } from "../../../../domain/entities/vendor.entity";

export interface IUpdateVendorProfileUsecase {
  execute(id: string, data: Partial<IVendorEntity>): Promise<void>;
}
