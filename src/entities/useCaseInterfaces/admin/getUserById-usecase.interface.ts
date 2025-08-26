import { VendorProfileDto } from "../../../shared/dto/vendor.dto";
import { IClientEntity } from "../../modelsEntity/client.entity";

export interface IGetUserByIdUsecase {
  execute(userType: string, userId: string): Promise<VendorProfileDto | IClientEntity>;
}
