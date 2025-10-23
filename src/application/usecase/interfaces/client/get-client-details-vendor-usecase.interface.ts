import { ClientDetailsForVendorDto } from "../../../dto/response/user.dto";

export interface IGetClientDetailsVendorUsecase {
  execute(userId: string): Promise<ClientDetailsForVendorDto | null>;
}