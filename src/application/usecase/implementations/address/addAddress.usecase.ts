import { inject, injectable } from "tsyringe";

import { IAddressRepository } from "../../../../domain/repositoryInterfaces/auth/address-repository.interface";
import { HTTP_STATUS, SUCCESS_MESSAGE } from "../../../../shared/constants";
import {
  ISuccessResponseHandler,
  successResponseHandler,
} from "../../../../shared/utils/successResponseHandler";
import { AddressDto } from "../../../dto/response/authDto";
import { IAddAddressUsecase } from "../../interfaces/auth/add-address-usecase.interface";

@injectable()
export class AddAddressUsecase implements IAddAddressUsecase {
  constructor(
    @inject("IAddressRepository")
    private addressRepository: IAddressRepository
  ) {}

  async execute(data: AddressDto): Promise<ISuccessResponseHandler> {
    await this.addressRepository.save(data);

    return successResponseHandler(
      true,
      HTTP_STATUS.CREATED,
      SUCCESS_MESSAGE.ADDRESS.ADDRESS_ADDED_SUCCESSFULLY
    );
  }
}
