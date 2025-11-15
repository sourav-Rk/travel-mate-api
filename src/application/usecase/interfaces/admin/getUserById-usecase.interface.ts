import { IClientEntity } from "../../../../domain/entities/client.entity";
import { VendorProfileDto } from "../../../dto/response/vendor.dto";

export interface IGetUserByIdUsecase {
  execute(
    userType: string,
    userId: string
  ): Promise<VendorProfileDto | IClientEntity>;
}
