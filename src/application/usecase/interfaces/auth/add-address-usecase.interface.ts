import { AddressDto } from "../../../dto/response/addressDto";
import { ISuccessResponseHandler } from "../../../../shared/utils/successResponseHandler";

export interface IAddAddressUsecase {
  execute(data: AddressDto): Promise<ISuccessResponseHandler>;
}
