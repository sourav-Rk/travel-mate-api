import { ISuccessResponseHandler } from "../../../../shared/utils/successResponseHandler";
import { AddressDto } from "../../../dto/response/addressDto";

export interface IAddAddressUsecase {
  execute(data: AddressDto): Promise<ISuccessResponseHandler>;
}
