import { inject, injectable } from "tsyringe";
import { ISaveFcmTokenUsecase } from "../../entities/useCaseInterfaces/fcmToken/saveFcmToken-usecase.interface";
import { IFCMTokenRepository } from "../../entities/repositoryInterfaces/fcmToken/fcmTokenRepository.interface";

@injectable()
export class SaveFcmTokenUsecase implements ISaveFcmTokenUsecase{
     constructor(
        @inject('IFCMTokenRepository')
        private _fcmTokenRepository : IFCMTokenRepository
     ){}

     async execute(userId: string, fcmToken: string): Promise<void> {
          await this._fcmTokenRepository.createFcmToken(userId,fcmToken);
     }
}