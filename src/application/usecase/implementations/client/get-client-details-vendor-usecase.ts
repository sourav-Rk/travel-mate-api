import { inject, injectable } from "tsyringe";

import { CustomError } from "../../../../domain/errors/customError";
import { IClientRepository } from "../../../../domain/repositoryInterfaces/client/client.repository.interface";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../../../shared/constants";
import { ClientDetailsForVendorDto } from "../../../dto/response/user.dto";
import { UserMapper } from "../../../mapper/user.mapper";
import { IGetClientDetailsVendorUsecase } from "../../interfaces/client/get-client-details-vendor-usecase.interface";

@injectable()
export class GetClientDetailsVendorUsecase
  implements IGetClientDetailsVendorUsecase
{
  constructor(
    @inject("IClientRepository")
    private _clientRepository: IClientRepository
  ) {}

  async execute(userId: string): Promise<ClientDetailsForVendorDto | null> {
    if (!userId)
      throw new CustomError(HTTP_STATUS.BAD_REQUEST, ERROR_MESSAGE.ID_REQUIRED);

    const client = await this._clientRepository.findById(userId);

    if (!client) {
      throw new CustomError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_MESSAGE.USER_NOT_FOUND
      );
    }

    return UserMapper.mapToClientDetailsForVendorDto(client);
  }
}
