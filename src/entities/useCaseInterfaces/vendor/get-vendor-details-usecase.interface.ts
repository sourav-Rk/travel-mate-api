import { IVendorEntity } from "../../modelsEntity/vendor.entity";

export interface IGetVendorDetailsUsecase{
    execute(id : any) : Promise<IVendorEntity | null>;
}