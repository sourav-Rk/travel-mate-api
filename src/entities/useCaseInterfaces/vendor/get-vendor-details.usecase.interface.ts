import { IVendorEntity } from "../../modelsEntity/vendor.entity";

export interface IGetVendorDetailsUsecase{
    execute(vendorId : any) : Promise<Partial<IVendorEntity|null>>;
}