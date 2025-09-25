import { inject, injectable } from "tsyringe";
import { IGetGuideDetailsClientUsecase } from "../../entities/useCaseInterfaces/guide/get-guide-details-client-usecase.interface";
import { IClientRepository } from "../../entities/repositoryInterfaces/client/client.repository.interface";
import { IGuideRepository } from "../../entities/repositoryInterfaces/guide/guide-repository.interface";
import { ValidationError } from "../../shared/utils/error/validationError";
import { ERROR_MESSAGE } from "../../shared/constants";
import { NotFoundError } from "../../shared/utils/error/notFoundError";
import { GuideMapper } from "../../interfaceAdapters/mappers/guide.mapper";
import { GuideDetailsForClientDto } from "../../shared/dto/guideDto";

@injectable()
export class GetGuideDetailsClient implements IGetGuideDetailsClientUsecase {
  constructor(
    @inject("IClientRepository")
    private _clientRepository: IClientRepository,

    @inject("IGuideRepository")
    private _guideRepository: IGuideRepository
  ) {}

  async execute(
    userId: string,
    guideId: string
  ): Promise<GuideDetailsForClientDto | null> {
    if (!userId || !guideId) {
      throw new ValidationError(ERROR_MESSAGE.ID_REQUIRED);
    }

    const user = await this._clientRepository.findById(userId);
    if (!user) {
      throw new NotFoundError(ERROR_MESSAGE.USER_NOT_FOUND);
    }

    const guide = await this._guideRepository.findById(guideId);
    if (!guide) {
      throw new NotFoundError(ERROR_MESSAGE.GUIDE_NOT_FOUND);
    }

    return GuideMapper.mapToGuideDetailsForClient(guide);
  }
}
