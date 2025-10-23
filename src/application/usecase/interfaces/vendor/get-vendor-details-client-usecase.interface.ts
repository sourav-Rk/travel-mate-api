import { IVendorEntity } from "../../../../domain/entities/vendor.entity";
import { VendorDetailsForClientDto } from "../../../dto/response/vendor.dto";

export interface IGetVendorDetailsClientUsecase{
    execute(vendorId: string): Promise<VendorDetailsForClientDto | null>
}