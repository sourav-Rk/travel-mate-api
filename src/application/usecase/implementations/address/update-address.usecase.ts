import { inject, injectable } from "tsyringe";

import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ValidationError } from "../../../../domain/errors/validationError";
import { IAddressRepository } from "../../../../domain/repositoryInterfaces/auth/address-repository.interface";
import { ERROR_MESSAGE } from "../../../../shared/constants";
import { AddressDto } from "../../../dto/response/authDto";
import { IUpdateAddressUsecase } from "../../interfaces/address/update-address-usecase.interface";

@injectable()
export class UpdateAddressUsecase implements IUpdateAddressUsecase {
  constructor(
    @inject("IAddressRepository")
    private _addressRepository: IAddressRepository
  ) {}

  async execute(id: string, data: AddressDto): Promise<void> {
    if (!id) {
      throw new ValidationError(ERROR_MESSAGE.ID_REQUIRED);
    }

    const addressExist = await this._addressRepository.findByUserId(id);

    if (!addressExist) {
      throw new NotFoundError(ERROR_MESSAGE.ADDRESS.ADDRESS_NOT_FOUND);
    }

    await this._addressRepository.findByIdAndUpdate(id, data);
  }
}
