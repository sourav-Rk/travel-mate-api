import { inject, injectable } from "tsyringe";
import { IUpdateClientDetailsUsecase } from "../../entities/useCaseInterfaces/client/updateClientDetails-usecase.interface";
import { ClientDto } from "../../shared/dto/user.dto";
import { CustomError } from "../../shared/utils/error/customError";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../shared/constants";
import { IClientRepository } from "../../entities/repositoryInterfaces/client/client.repository.interface";
import { NotFoundError } from "../../shared/utils/error/notFoundError";
import { IClientEntity } from "../../entities/modelsEntity/client.entity";
import { IUserExistenceService } from "../../entities/serviceInterfaces/user-existence-service.interface";
import { IPhoneExistenceService } from "../../entities/serviceInterfaces/phone-existence-service.interface";

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

  async execute(userId: any, data: Partial<IClientEntity>): Promise<void> {
    if (!userId || !data) {
      throw new CustomError(
        HTTP_STATUS.BAD_REQUEST,
        "User id or required data  is missing"
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

    await this._clientRepository.updateClientProfileById(userId, data);
  }
}
