import { inject, injectable } from "tsyringe";

import { IClientEntity } from "../../../../domain/entities/client.entity";
import { CustomError } from "../../../../domain/errors/customError";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { IClientRepository } from "../../../../domain/repositoryInterfaces/client/client.repository.interface";
import { IPhoneExistenceService } from "../../../services/interfaces/phone-existence-service.interface";
import { IUserExistenceService } from "../../../services/interfaces/user-existence-service.interface";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../../../shared/constants";
import { IUpdateClientDetailsUsecase } from "../../interfaces/client/updateClientDetails-usecase.interface";

@injectable()
export class UpdateClientDetailsUsecase implements IUpdateClientDetailsUsecase {
  constructor(
    @inject("IClientRepository")
    private _clientRepository: IClientRepository,

    @inject("IUserExistenceService")
    private _userExistenceService: IUserExistenceService,

    @inject("IPhoneExistenceService")
    private _phoneExistenceService: IPhoneExistenceService
  ) {}

  async execute(userId: string, data: Partial<IClientEntity>): Promise<void> {
    if (!userId || !data) {
      throw new CustomError(
        HTTP_STATUS.BAD_REQUEST,
        ERROR_MESSAGE.USER_ID_REQUIRED
      );
    }

    const client = await this._clientRepository.findById(userId);

    if (!client) throw new NotFoundError(ERROR_MESSAGE.USER_NOT_FOUND);

    if (data.email !== client?.email && data.email) {
      const existingEmail = await this._userExistenceService.emailExists(
        data?.email
      );
      if (existingEmail)
        throw new CustomError(HTTP_STATUS.CONFLICT, ERROR_MESSAGE.EMAIL_EXISTS);
    }

    if (data.phone !== client?.phone && data.phone) {
      const existingPhone = await this._phoneExistenceService.phoneExists(
        data.phone
      );
      if (existingPhone)
        throw new CustomError(
          HTTP_STATUS.CONFLICT,
          ERROR_MESSAGE.PHONE_NUMBER_EXISTS
        );
    }

    await this._clientRepository.updateById(userId, data);
  }
}
