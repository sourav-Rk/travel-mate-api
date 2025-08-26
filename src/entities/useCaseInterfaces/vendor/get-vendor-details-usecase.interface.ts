import { VendorProfileDto } from "../../../shared/dto/vendor.dto";

export interface IGetVendorDetailsUsecase{
    execute(id : any) : Promise<VendorProfileDto | null>;
}