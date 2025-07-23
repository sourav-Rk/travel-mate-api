import { IVendorEntity } from "../../modelsEntity/vendor.entity";

export interface IGetVendorDetailsForStatusUsecase{
    execute(vendorId : any) : Promise<Partial<IVendorEntity|null>>;
}