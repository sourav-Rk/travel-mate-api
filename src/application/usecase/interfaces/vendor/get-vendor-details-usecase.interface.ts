import { VendorProfileDto } from "../../../dto/response/vendor.dto";

export interface IGetVendorDetailsUsecase {
  execute(id: string): Promise<VendorProfileDto | null>;
}
