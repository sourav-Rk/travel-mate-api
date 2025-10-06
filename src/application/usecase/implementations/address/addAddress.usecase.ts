import { inject, injectable } from "tsyringe";

import { IAddressRepository } from "../../../../domain/repositoryInterfaces/auth/address-repository.interface";
import { IAddAddressUsecase } from "../../interfaces/auth/add-address-usecase.interface";
import { HTTP_STATUS } from "../../../../shared/constants";
import { AddressDto } from "../../../dto/response/authDto";
import {
  ISuccessResponseHandler,
  successResponseHandler,
} from "../../../../shared/utils/successResponseHandler";

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
      "address added successfully"
    );
  }
}
