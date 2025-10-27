import { inject, injectable } from "tsyringe";

import { IFCMTokenRepository } from "../../../../domain/repositoryInterfaces/fcmToken/fcmTokenRepository.interface";
import { ISaveFcmTokenUsecase } from "../../interfaces/fcmToken/saveFcmToken-usecase.interface";

@injectable()
export class SaveFcmTokenUsecase implements ISaveFcmTokenUsecase {
  constructor(
    @inject("IFCMTokenRepository")
    private _fcmTokenRepository: IFCMTokenRepository
  ) {}

  async execute(userId: string, fcmToken: string): Promise<void> {
    await this._fcmTokenRepository.createFcmToken(userId, fcmToken);
  }
}
