import { inject, injectable } from "tsyringe";
import { IGetGuideDetailsClientUsecase } from "../../interfaces/guide/get-guide-details-client-usecase.interface";
import { IClientRepository } from "../../../../domain/repositoryInterfaces/client/client.repository.interface";
import { IGuideRepository } from "../../../../domain/repositoryInterfaces/guide/guide-repository.interface";
import { ValidationError } from "../../../../domain/errors/validationError";
import { ERROR_MESSAGE } from "../../../../shared/constants";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { GuideMapper } from "../../../mapper/guide.mapper";
import { GuideDetailsForClientDto } from "../../../dto/response/guideDto";

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
