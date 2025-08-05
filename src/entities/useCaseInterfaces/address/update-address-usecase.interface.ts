import { AddressDto } from "../../../shared/dto/addressDto";

export interface IUpdateAddressUsecase {
    execute(id : string,data : AddressDto) : Promise<void>;
}