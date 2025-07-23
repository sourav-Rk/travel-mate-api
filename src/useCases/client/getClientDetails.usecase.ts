import { inject, injectable } from "tsyringe";
import { IGetClientDetailsUsecase } from "../../entities/useCaseInterfaces/client/getClientDetails-usecase.interface";
import { IUserEntity } from "../../entities/modelsEntity/user.entity";
import { CustomError } from "../../shared/utils/error/customError";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../shared/constants";
import { IClientEntity } from "../../entities/modelsEntity/client.entity";
import { IClientRepository } from "../../entities/repositoryInterfaces/client/client.repository.interface";

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
