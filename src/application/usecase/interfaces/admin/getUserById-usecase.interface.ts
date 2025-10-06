import { VendorProfileDto } from "../../../dto/response/vendor.dto";
import { IClientEntity } from "../../../../domain/entities/client.entity";

export interface IGetUserByIdUsecase {
  execute(
    userType: string,
    userId: string
  ): Promise<VendorProfileDto | IClientEntity>;
}
