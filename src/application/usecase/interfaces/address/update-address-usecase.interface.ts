import { AddressDto } from "../../../dto/response/addressDto";

export interface IUpdateAddressUsecase {
  execute(id: string, data: AddressDto): Promise<void>;
}
