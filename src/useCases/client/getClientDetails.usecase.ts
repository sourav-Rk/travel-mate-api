import { inject, injectable } from "tsyringe";

import { IClientEntity } from "../../entities/modelsEntity/client.entity";
import { IClientRepository } from "../../entities/repositoryInterfaces/client/client.repository.interface";
import { IGetClientDetailsUsecase } from "../../entities/useCaseInterfaces/client/getClientDetails-usecase.interface";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../shared/constants";
import { CustomError } from "../../shared/utils/error/customError";

@injectable()
export class GetClientDetailsUsecase implements IGetClientDetailsUsecase {
  constructor(
    @inject("IClientRepository")
    private _clientRepository: IClientRepository
  ) {}
  async execute(userId: string): Promise<IClientEntity | null> {
    if (!userId)
      throw new CustomError(HTTP_STATUS.BAD_REQUEST, "user id is required");

    const client = await this._clientRepository.findById(userId);

    if (!client) {
      throw new CustomError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_MESSAGE.USER_NOT_FOUND
      );
    }

    return client;
  }
}
