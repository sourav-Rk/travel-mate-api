export interface ISaveFcmTokenUsecase {
    execute(userId : string,fcmToken : string) : Promise<void>;
}