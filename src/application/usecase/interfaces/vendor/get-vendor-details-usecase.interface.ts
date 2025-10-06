import { VendorProfileDto } from "../../../dto/response/vendor.dto";

export interface IGetVendorDetailsUsecase {
  execute(id: any): Promise<VendorProfileDto | null>;
}
