import { IVendorEntity } from "../../modelsEntity/vendor.entity";

export interface IUpdateVendorProfileUsecase{
    execute(id : string,data : Partial<IVendorEntity>) : Promise<void>;
}