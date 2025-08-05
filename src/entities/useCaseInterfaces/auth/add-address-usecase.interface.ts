import { AddressDto } from "../../../shared/dto/addressDto";
import { ISuccessResponseHandler } from "../../../shared/utils/successResponseHandler";

export interface IAddAddressUsecase {
    execute(data : AddressDto): Promise<ISuccessResponseHandler>;
}